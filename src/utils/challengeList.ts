interface Challenge {
  id: string;
  duration: number;
  title: string;
  tag: string;
  description: string;
  points: number;
}

const challengeList: Array<Challenge> = [
  {
    id: "1",
    duration: 14,
    title: "Getting better at Talking",
    tag: "Communication",
    description: "Use the debate feature 5 times",
    points: 20
  },
  {
    id: "2",
    duration: 7,
    title: "Reflective Journaling",
    tag: "Mindfulness",
    description: "Write a personal reflection in your journal for 7 consecutive days",
    points: 15
  },
  {
    id: "3",
    duration: 30,
    title: "Thought Exploration",
    tag: "Creativity",
    description: "Connect at least 10 recorded ideas using the Idea Search and Connection feature",
    points: 25
  },
  {
    id: "4",
    duration: 7,
    title: "Positive Commentator",
    tag: "Community",
    description: "Leave positive comments on 5 different posts",
    points: 10
  },
  {
    id: "5",
    duration: 30,
    title: "Informed Mind",
    tag: "Knowledge",
    description: "Share 3 informative articles in the Topic Discussion section",
    points: 15
  },
  {
    id: "6",
    duration: 21,
    title: "Expressive Artistry",
    tag: "Creativity",
    description: "Create a drawing or painting expressing an emotion every 3 days for 21 days",
    points: 30
  },
  {
    id: "7",
    duration: 14,
    title: "Mindful Breathing",
    tag: "Mindfulness",
    description: "Practice deep breathing exercises for 10 minutes daily for 14 days",
    points: 20
  },
  {
    id: "8",
    duration: 7,
    title: "Spread Positivity",
    tag: "Community",
    description: "Post an uplifting message or quote in the Topic Discussion section every day for a week",
    points: 15
  },
  {
    id: "9",
    duration: 14,
    title: "Inspiring Bookworm",
    tag: "Knowledge",
    description: "Read and complete two personal development books within two weeks",
    points: 25
  },
  {
    id: "10",
    duration: 30,
    title: "Meditation Master",
    tag: "Mindfulness",
    description: "Complete 20 meditation sessions using VoiceVault's guided meditation feature",
    points: 30
  },
  {
    id: "11",
    duration: 14,
    title: "Thoughtful Contributor",
    tag: "Community",
    description: "Contribute to at least 10 discussions by posting insightful comments",
    points: 15
  },
  {
    id: "12",
    duration: 7,
    title: "Grammar Guru",
    tag: "Communication",
    description: "Use VoiceVault's Rephrasing Tool to improve grammar and clarity in 10 of your posts",
    points: 15
  },
  {
    id: "13",
    duration: 30,
    title: "Curious Learner",
    tag: "Knowledge",
    description: "Explore and share interesting facts or trivia in the Topic Discussion section every day for a month",
    points: 25
  },
  {
    id: "14",
    duration: 21,
    title: "Vocal Confidence",
    tag: "Communication",
    description: "Record and listen to yourself speaking on a different topic each day for 21 days",
    points: 20
  },
  {
    id: "15",
    duration: 14,
    title: "Gratitude Practice",
    tag: "Mindfulness",
    description: "Write down three things you're grateful for in your journal every day for two weeks",
    points: 15
  },
  {
    id: "16",
    duration: 7,
    title: "Empathy Advocate",
    tag: "Community",
    description: "Offer support and empathetic responses to 5 users who share their challenges",
    points: 10
  },
  {
    id: "17",
    duration: 30,
    title: "Thought Leader",
    tag: "Knowledge",
    description: "Start 5 engaging discussions in the Topic Discussion section to spark insightful conversations",
    points: 20
  },
  {
    id: "18",
    duration: 21,
    title: "Creative Writing",
    tag: "Creativity",
    description: "Write a short story or poem every three days for three weeks",
    points: 25
  },
  {
    id: "19",
    duration: 14,
    title: "Digital Detox",
    tag: "Well-being",
    description: "Take a break from social media for two weeks and record your experiences in your journal",
    points: 20
  },
  {
    id: "20",
    duration: 7,
    title: "Cheerful Messenger",
    tag: "Community",
    description: "Send uplifting direct messages to 5 different users to brighten their day",
    points: 10
  },
  {
    id: "21",
    duration: 30,
    title: "Diverse Reading",
    tag: "Knowledge",
    description: "Read and share articles from different genres and subjects every day for a month",
    points: 30
  },
  {
    id: "22",
    duration: 21,
    title: "Sketching Challenge",
    tag: "Creativity",
    description: "Create a sketch or doodle each day for three weeks, exploring various subjects",
    points: 20
  },
  {
    id: "23",
    duration: 14,
    title: "Gratitude Letter",
    tag: "Mindfulness",
    description: "Write a heartfelt gratitude letter to someone in your life and share your experience",
    points: 15
  },
  {
    id: "24",
    duration: 7,
    title: "Supportive Friend",
    tag: "Community",
    description: "Offer encouragement and advice to 5 users who seek support in their posts",
    points: 10
  },
  {
    id: "25",
    duration: 30,
    title: "Fascinating Trivia",
    tag: "Knowledge",
    description: "Share an interesting fact or trivia about a different topic every day for a month",
    points: 20
  },
  {
    id: "26",
    duration: 21,
    title: "Artistic Expression",
    tag: "Creativity",
    description: "Create a digital or traditional artwork every three days for three weeks",
    points: 25
  },
  {
    id: "27",
    duration: 14,
    title: "Digital Well-being",
    tag: "Well-being",
    description: "Set a daily screen time limit and track your progress for two weeks",
    points: 15
  },
  {
    id: "28",
    duration: 7,
    title: "Random Act of Kindness",
    tag: "Community",
    description: "Perform a small act of kindness each day for a week and share your experiences",
    points: 10
  },
  {
    id: "29",
    duration: 30,
    title: "Inquisitive Mind",
    tag: "Knowledge",
    description: "Pose thought-provoking questions in the Topic Discussion section to stimulate meaningful conversations",
    points: 20
  },
  {
    id: "30",
    duration: 21,
    title: "Photography Journey",
    tag: "Creativity",
    description: "Capture and share a photo each day for three weeks, exploring different subjects and techniques",
    points: 25
  },
  {
    id: "31",
    duration: 14,
    title: "Self-Care Rituals",
    tag: "Well-being",
    description: "Practice a self-care activity of your choice for 30 minutes each day for two weeks",
    points: 15
  },
  {
    id: "32",
    duration: 7,
    title: "Inspiring Playlist",
    tag: "Creativity",
    description: "Curate a motivational playlist and share it with the VoiceVault community",
    points: 10
  },
  {
    id: "33",
    duration: 30,
    title: "Book Club Enthusiast",
    tag: "Knowledge",
    description: "Start a book club within the VoiceVault community and lead discussions on selected books",
    points: 30
  },
  {
    id: "34",
    duration: 21,
    title: "Cooking Adventures",
    tag: "Creativity",
    description: "Try out a new recipe and share your culinary creation with the community every three days for three weeks",
    points: 20
  },
  {
    id: "35",
    duration: 14,
    title: "Gratitude Photo Journal",
    tag: "Mindfulness",
    description: "Capture and share a photo of something you're grateful for every day for two weeks",
    points: 15
  },
  {
    id: "36",
    duration: 7,
    title: "Daily Affirmations",
    tag: "Well-being",
    description: "Write and repeat positive affirmations to yourself every day for a week",
    points: 10
  },
  {
    id: "37",
    duration: 30,
    title: "Interview Series",
    tag: "Knowledge",
    description: "Conduct and record interviews with interesting individuals in your community and share the insights",
    points: 25
  },
  {
    id: "38",
    duration: 21,
    title: "Crafting Marathon",
    tag: "Creativity",
    description: "Engage in a craft project every three days for three weeks, using different materials and techniques",
    points: 20
  },
  {
    id: "39",
    duration: 14,
    title: "Morning Gratitude",
    tag: "Mindfulness",
    description: "Write down three things you're grateful for every morning for two weeks",
    points: 15
  },
  {
    id: "40",
    duration: 7,
    title: "Fitness Challenge",
    tag: "Well-being",
    description: "Complete a 15-minute workout every day for a week and track your progress",
    points: 10
  }
];

export default challengeList