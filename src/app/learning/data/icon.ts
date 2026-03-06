import { Award, CodeXml, ChartBar, LucideIcon, User, Trophy, Book, ShoppingCart, ShoppingBag, ChartLine, CheckCircle, Lock, LockOpen, Brain, RotateCcw, Palette, Lightbulb, HeartPulse, Ghost, Cpu, ShieldHalf, Bookmark, Bolt } from 'lucide-react';

export const LUCIDE_ICONS = {
    "CodeXml": CodeXml,
    "ChartBar": ChartBar,
    "Award": Award,
    "User": User,
    "Trophy": Trophy,
    "Book": Book,
    "ShoppingCart": ShoppingCart,
    "ShoppingBag": ShoppingBag,
    "ChartLine": ChartLine,
    "CheckCircle": CheckCircle,
    "Lock": Lock,
    "LockOpen": LockOpen,
    "Brain": Brain,
    "RotateCcw": RotateCcw,
    "Palette": Palette,
    "Lightbulb": Lightbulb,
    "HeartPulse": HeartPulse,
    "Ghost": Ghost,
    "Cpu": Cpu,
    "ShieldHalf": ShieldHalf,
    "Bookmark": Bookmark,
    "Bolt": Bolt,
    "fa-bolt": Bolt,
    "fa-shield-halved": ShieldHalf,
    "fa-ghost": Ghost,
    "fa-microchip": Cpu,
    "fa-book-bookmark": Bookmark,
    "fa-lightbulb": Lightbulb,
    "fa-palette": Palette,
    "fa-heart-pulse": HeartPulse,
    "fa-award": Award
} as const;

export type IconName = keyof typeof LUCIDE_ICONS;