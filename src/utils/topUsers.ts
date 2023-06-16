interface User {
  id: number;
  name: string;
  email: string
  points: number
}

const leaderboard: Array<User> = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    points: 250
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    points: 200
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    points: 180
  },
  {
    id: 4,
    name: "Emily Brown",
    email: "emily.brown@example.com",
    points: 170
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.wilson@example.com",
    points: 150
  },
  {
    id: 6,
    name: "Sarah Taylor",
    email: "sarah.taylor@example.com",
    points: 140
  },
  {
    id: 7,
    name: "Michael Lee",
    email: "michael.lee@example.com",
    points: 130
  },
  {
    id: 8,
    name: "Jessica Anderson",
    email: "jessica.anderson@example.com",
    points: 120
  },
  {
    id: 9,
    name: "Ryan Martinez",
    email: "ryan.martinez@example.com",
    points: 110
  },
  {
    id: 10,
    name: "Olivia Thompson",
    email: "olivia.thompson@example.com",
    points: 100
  }
];


export default leaderboard