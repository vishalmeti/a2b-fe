
// Sample data - In a real app, this would come from an API
export const itemsData = [
    {
      id: "1",
      name: "Power Drill",
      description: "Professional cordless power drill, perfect for small home projects. Includes two batteries and a charger. Great for drilling holes in walls, wood, and other materials. Recently serviced and in excellent condition.",
      images: [
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1540104539488-92a51bbc0410?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
      ],
      owner: {
        id: "user1",
        name: "Alex Smith",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 4.8,
        responseRate: "99%",
        responseTime: "< 1 hour",
        memberSince: "Jan 2022",
      },
      location: {
        neighborhood: "Brighton Heights",
        distance: "0.5 miles away",
        address: "123 Main St, Pittsburgh, PA"
      },
      details: {
        condition: "Excellent",
        brand: "DeWalt",
        estimatedValue: "$150",
        ageOfItem: "2 years",
        category: "Tools",
        tags: ["power tools", "DIY", "home improvement"]
      },
      borrowingTerms: {
        returnPeriod: "3-7 days",
        securityDeposit: "$50",
        meetupPreference: "Porch pickup",
        additionalNotes: "Please charge batteries before returning."
      },
      availability: "Available now",
      reviews: [
        {
          userId: "user5",
          userName: "Sarah Johnson",
          userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
          rating: 5,
          date: "March 15, 2023",
          comment: "The drill worked perfectly for my project. Alex was very responsive and flexible with pickup and return times."
        },
        {
          userId: "user6",
          userName: "Mike Peterson",
          userAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
          rating: 5,
          date: "February 2, 2023",
          comment: "Great tool, well maintained. Appreciated the extra battery!"
        }
      ]
    },
    // More items would be here in a real app
  ];
  