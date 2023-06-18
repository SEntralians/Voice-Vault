interface PostData {
  id: number;
  date: string;
  tag: string;
  title: string;
  body: string;
  image: string;
  userName: string;
}

export const posts: PostData[] = [
  {
    id: 1,
    date: "Jun 16, 2023",
    tag: "Life-Crisis",
    title: "I just realized...",
    body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!",
    image:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=731&q=80",
    userName: "Alex John",
  },
  {
    id: 2,
    date: "Jun 7, 2023",
    tag: "Shower Thoughts",
    title: "Human Reset Button",
    body: `"Go to bed, you'll feel better in the morning" is the human version of "Did you turn it off and turn it back on again?"`,
    image:
      "https://images.unsplash.com/photo-1464863979621-258859e62245?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=333&q=80",
    userName: "Jane Doe",
  },
  {
    id: 3,
    date: "Jun 1, 2023",
    tag: "Debate",
    title: "Should a country have the power to ban books?",
    body: "I think that its a person's right to be able to read whatever books they want, whether it opposes the current government's views. What do you think?",
    image:
      "https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=281&q=80",
    userName: "Lisa Way",
  },
  {
    id: 4,
    date: "May 29, 2023",
    tag: "Anime",
    title: "Oshi no Ko Best Girl",
    body: "Just hear me out for a moment... KANA SUPREMACY. Change my mind.",
    image:
      "https://images.unsplash.com/photo-1500757810556-5d600d9b737d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=735&q=80",
    userName: "Steve Matt",
  },
  {
    id: 5,
    date: "May 21, 2023",
    tag: "Shower Thoughts",
    title: "Dog naming conventions",
    body: "I wonder what my dog named me. Huh... that's going to stick in my head for a while.",
    image:
      "https://images.unsplash.com/photo-1502980426475-b83966705988?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=373&q=80",
    userName: "Khatab Wedaa",
  },
];
