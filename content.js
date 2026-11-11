/*
 * ALL SITE CONTENT LIVES HERE.
 * Edit this file to change the site — no HTML changes needed.
 */
window.PORTFOLIO = {
  name: "Alan Zheng",
  role: "Mechatronics Engineering Student",
  tagline:
    "I write embedded firmware and robotics software at Queen's University, and I'm looking for a 12–16 month internship.",

  // Shown in the "title block" beside your name on the home page.
  facts: [
    { label: "Discipline", value: "Mechatronics and Robotics Engineering" },
    { label: "School", value: "Queen's University, class of 2029" },
    { label: "Focus", value: "Embedded systems, robotics, controls" },
    { label: "Status", value: "Seeking a 12–16 month internship" },
  ],

  about: [
    "I'm a Mechatronics and Robotics Engineering student at Queen's University in Kingston, Ontario, and a Dean Scholar for 2025–2026. Most of what I build sits where software meets hardware: firmware on microcontrollers, and ROS 2 software for robots that have to move through real rooms.",
    "On the Queen's Knights Robotics Team I work on autonomous navigation for a four-wheel RoboMaster rover, testing in Gazebo before anything runs on the robot. In my own projects I've written FreeRTOS firmware for an ESP32, PID motor control on an Arduino, and Nios II assembly on a DE0 FPGA board.",
    "My third-year coursework covers computer architecture, embedded systems, sensors and actuators, signals and systems, and automatic controls. I'm comfortable on the bench with an oscilloscope, multimeter, DC power supply and function generator.",
  ],

  skills: [
    { group: "Languages", items: ["C/C++", "Python", "Nios II Assembly"] },
    { group: "Frameworks & platforms", items: ["ROS 2", "FreeRTOS", "Linux"] },
    { group: "Hardware", items: ["ESP32", "Arduino", "Raspberry Pi", "Intel DE0 FPGA", "LiDAR"] },
    { group: "Developer tools", items: ["Git", "GitHub", "GCC", "GDB", "VS Code", "RViz", "Gazebo"] },
    { group: "Lab & CAD", items: ["Oscilloscope", "Multimeter", "DC power supply", "Function generator", "SolidWorks", "Fusion 360"] },
  ],

  experience: [
    {
      period: "Sept. 2025 — Present",
      title: "Autonomous Navigation Team Member",
      org: "Queen's Knights Robotics Team",
      summary:
        "Develop and test autonomous-navigation software for a four-wheel RoboMaster rover using ROS 2 on Linux. Built a URDF model of the rover's geometry, joints and sensors to test navigation in Gazebo before deployment, and tuned navigation parameters across simulation runs to improve accuracy.",
    },
    {
      period: "May 2025 — Aug. 2025",
      title: "Summer Camp Coding Instructor",
      org: "Canadian STEM and AI Academy, Markham",
      summary:
        "Taught Python fundamentals to students aged 8–13 and guided them in building terminal-based games, adapting explanations to different learning levels.",
    },
    {
      period: "Sept. 2024 — May 2029 (expected)",
      title: "BASc, Mechatronics and Robotics Engineering",
      org: "Queen's University, Kingston",
      summary:
        "Dean Scholar Distinction 2025–2026. Coursework in computer architecture, embedded systems, sensors and actuators, signals and systems, and automatic controls.",
    },
  ],

  /*
   * Projects. `featured: true` shows the project on the home page.
   * `image` is optional: a path such as "images/rover.jpg". Without it a
   * numbered figure placeholder is drawn instead.
   * `links` is optional: [{ label: "Code", url: "https://…" }]
   */
  projects: [
    {
      id: "mapping-rover",
      title: "Mapping Rover",
      year: "2026",
      category: "Robotics",
      featured: true,
      image: "",
      summary: "A ROS 2 rover that mapped a classroom in real time, built as a team project.",
      problem:
        "Map a classroom live from a small rover. Before the map could be trusted, the rover had to drive in a straight line without drifting.",
      approach:
        "Python ROS 2 nodes (rclpy) on a Raspberry Pi fed LiDAR and odometry into SLAM Toolbox and commanded an Arduino over serial. On the Arduino I implemented closed-loop PID motor control.",
      outcome:
        "The PID loop eliminated drift: the rover drove straight in 15 of 15 trials. I also managed the team's Git workflow, reviewing commits, resolving merge conflicts and coordinating pull requests.",
      tools: ["Python", "C/C++", "ROS 2", "Raspberry Pi", "Arduino", "LiDAR", "Linux", "Git"],
      links: [],
    },
    {
      id: "temperature-monitor",
      title: "Temperature Monitor",
      year: "2025",
      category: "Embedded",
      featured: true,
      image: "",
      summary: "C firmware for an ESP32 on FreeRTOS that samples temperature at 10 Hz and reports it over serial.",
      problem:
        "Sample a temperature sensor at a steady 10 Hz and report a smoothed value, without the reporting work ever blocking the sampling.",
      approach:
        "Interrupt-driven readings go into a 10-sample circular buffer that gives a running average. Tasks are synchronized with mutexes, semaphores and spinlocks.",
      outcome:
        "A working monitor that reports a running average over serial. Along the way I traced deadlocks and timer faults using serial logging and GDB.",
      tools: ["C", "FreeRTOS", "ESP32", "GDB"],
      links: [],
    },
    {
      id: "model-elevator",
      title: "Model Elevator",
      year: "2025",
      category: "Embedded",
      featured: true,
      image: "",
      summary: "A fully functional 5-storey model elevator run by C/C++ firmware on an Arduino.",
      problem:
        "Serve floor requests arriving in any order across five storeys without sending the car on unnecessary trips.",
      approach:
        "Floor requests are held in min-heap and max-heap priority queues written in C, so the firmware can order and prioritize them by direction of travel.",
      outcome:
        "A working model elevator with a floor-selection algorithm optimized to minimize unnecessary travel.",
      tools: ["C/C++", "Arduino", "Priority queues"],
      links: [],
    },
    {
      id: "watchdog",
      title: "WatchDog",
      year: "2025",
      category: "Hackathon",
      featured: false,
      image: "",
      summary: "A Raspberry Pi anti-theft prototype that notices when a monitored item leaves the camera's view.",
      problem: "Know right away when something you are watching over gets taken, and have evidence of it.",
      approach:
        "A Python program on a Raspberry Pi watches monitored items through a camera and detects when one leaves the frame.",
      outcome:
        "When an item is removed, the prototype triggers an alarm and emails a captured image. It was demonstrated working end to end within the hackathon timeframe.",
      tools: ["Python", "Raspberry Pi", "Git"],
      links: [],
    },
  ],

  contact: {
    blurb:
      "I'm looking for a 12–16 month internship in embedded systems, robotics or hardware. Email is the best way to reach me.",
    email: "zheng.alan.work@gmail.com",
    resumeUrl: "", // e.g. "resume.pdf" placed in this folder; leave empty to hide the button
    links: [
      { label: "GitHub", url: "https://github.com/Linknerd" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/alan-sq-zheng" },
    ],
  },
};
