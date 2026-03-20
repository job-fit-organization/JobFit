from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from api.models import Attempt
from .serializer import QuizHistorySerializer, JobTestHistorySerializer

# Create your views here.
# GET /users/mypage/quiz-history/
class QuizHistoryView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        attempts = Attempt.objects.filter(
            user=request.user,
            attempt_type='quiz',
        ).select_related('learning').prefetch_related('responses').order_by('-created_at')

        serializer = QuizHistorySerializer(attempts, many=True)
        return Response(serializer.data)

# GET /user/mypage/job-test-history
class JobTestHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        attempts = Attempt.objects.filter(
            user=request.user,
            attempt_type='job_test'
        ).select_related('recommended_job').order_by('-created_at')

        serializer = JobTestHistorySerializer(attempts, many=True)
        return Response(serializer.data)