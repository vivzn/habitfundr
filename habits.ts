const HabitType = {
    DO: 'DO',
    STOP: 'STOP'
};

const habits = [
    {
      name: "Basic Mewing",
      outcome: "Improves jawline definition, enhances facial structure, and promotes better oral posture.",
      tutorial: {
        steps: [
          "Close your mouth gently, ensuring your teeth are lightly touching but not clenched.",
          "Place the entire tongue, including the back part, flat against the roof of your mouth.",
          "Keep your lips closed and relaxed without pursing them.",
          "Breathe through your nose at all times."
        ],
        tips: [
          "Practice in front of a mirror to ensure proper tongue placement.",
          "Start by holding the posture for a few minutes and gradually increase the time."
        ]
      },
      recommended: {
        frequency: "Every day, as often as possible.",
        duration: "Start with 15-30 minutes and aim to make it a natural habit throughout the day."
      },
      precautions: [
        "Avoid pressing too hard with your tongue, as it may cause discomfort or strain.",
        "Ensure proper breathing through your nose to avoid mouth-breathing habits."
      ]
    },
    
  ];

export default habits;