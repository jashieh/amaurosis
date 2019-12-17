const levels = {
  1: {
    walls: [
      { topLeft: [0, 500],
        bottomRight: [50, 600],
      },
      { topLeft: [0,0],
        bottomRight: [500, 500],
      },
      { topLeft: [0, 600],
        bottomRight: [1000, 1200],
      },
      { topLeft: [600, 0],
        bottomRight: [1000, 1200],
      },
    ],
    goal: { topLeft: [500, 0],
      bottomRight: [600, 100],
    },
    start: [100, 550],
    enemies: [
      [400, 550]
    ]
  },

  2: {
    walls: [
      { topLeft: [0, 500],
        bottomRight: [50, 600],
      },
      { topLeft: [0,0],
        bottomRight: [500, 500],
      },
      { topLeft: [0, 600],
        bottomRight: [1000, 1200],
      },
    ],
    goal: { topLeft: [500, 0],
      bottomRight: [600, 100],
    },
    start: [100, 550],
    enemies: [
      [400, 550]
    ]
  },
};

export default levels;