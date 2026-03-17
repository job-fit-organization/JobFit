from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from .models import JobCategory, JobRecommendationQuestion, JobRecommendationChoice, TestHistory

class AIJobRecommendationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='test@test.com', password='testpassword')
        
        self.job1 = JobCategory.objects.create(name='Data Scientist', description='Analyzes data.')
        self.job2 = JobCategory.objects.create(name='Frontend Developer', description='Builds UI.')
        
        self.questions = []
        for i in range(15):
            q = JobRecommendationQuestion.objects.create(content=f'Q{i}', order=i)
            JobRecommendationChoice.objects.create(
                question=q, 
                content=f'C{i}_1', 
                score_profile={str(self.job1.id): 10, str(self.job2.id): 2}
            )
            JobRecommendationChoice.objects.create(
                question=q, 
                content=f'C{i}_2', 
                score_profile={str(self.job1.id): 1, str(self.job2.id): 10}
            )
            self.questions.append(q)
        
        self.question1 = self.questions[0]
        self.q1_choice1 = self.question1.choices.first()
        self.q1_choice2 = self.question1.choices.last()

    def test_get_questions(self):
        url = reverse('recommendation:get_recommendation_questions')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['content'], 'Q1')
        self.assertEqual(len(response.data[0]['choices']), 2)

    def test_submit_answers_anonymous(self):
        url = reverse('recommendation:submit_recommendation_test')
        data = {
            'answers': [
                {'question_id': self.question1.id, 'choice_id': self.q1_choice1.id}
            ]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Category 1 should be recommended because it gets 10 points
        self.assertEqual(response.data['id'], self.job1.id)
        # History should NOT be created
        self.assertEqual(TestHistory.objects.count(), 0)

    def test_submit_answers_authenticated(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('recommendation:submit_recommendation_test')
        data = {
            'answers': [
                {'question_id': self.question1.id, 'choice_id': self.q1_choice2.id}
            ]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Category 2 should be recommended because it gets 10 points
        self.assertEqual(response.data['id'], self.job2.id)
        
        # History SHOULD be created
        self.assertEqual(TestHistory.objects.count(), 1)
        history = TestHistory.objects.first()
        self.assertEqual(history.user, self.user)
        self.assertEqual(history.recommended_job, self.job2)
        self.assertEqual(history.answers, {str(self.question1.id): self.q1_choice2.id})

    def test_get_history_authenticated(self):
        # Create history first
        TestHistory.objects.create(
            user=self.user,
            recommended_job=self.job1,
            answers={str(self.question1.id): self.q1_choice1.id}
        )
        self.client.force_authenticate(user=self.user)
        url = reverse('recommendation:get_recommendation_history')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['recommended_job']['id'], self.job1.id)

    def test_get_history_anonymous(self):
        url = reverse('recommendation:get_recommendation_history')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
