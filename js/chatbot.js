(function () {
  "use strict";

  // Create UI
  const botHTML = `
    <button class="chatbot-toggler" aria-label="Toggle Chatbot">
      <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 5.582 2 10c0 2.476 1.341 4.675 3.425 6.134V22l3.435-2.29c1.002.292 2.054.456 3.14.456 5.523 0 10-3.582 10-8s-4.477-8-10-8zm0 14c-1.025 0-1.996-.15-2.906-.425l-2.094 1.396v-2.316C5.074 13.411 4 11.802 4 10c0-3.309 3.582-6 8-6s8 2.691 8 6-3.582 6-8 6z"/></svg>
    </button>
    <div class="chatbot-window">
      <div class="chatbot-header">
        <div class="chatbot-header-title">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 5.58 2 10c0 2.08 1.05 3.96 2.75 5.25L4 22l4.16-2.08A11.08 11.08 0 0012 20c5.52 0 10-3.58 10-8s-4.48-8-10-8z"/></svg>
          Sarbeswar Bot
        </div>
        <button class="chatbot-close" aria-label="Close Chat">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="chatbot-body" id="chatbotBody">
        <div class="chatbot-message bot">Hi there! I am Sarbeswar's AI assistant. Ask me anything about his skills, experience, projects, or contact info!</div>
      </div>
      <div class="chatbot-footer">
        <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Ask a question..." autocomplete="off" />
        <button class="chatbot-send" id="chatbotSend" aria-label="Send Message">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = botHTML;
  document.body.appendChild(container);

  const toggler = document.querySelector('.chatbot-toggler');
  const chatWindow = document.querySelector('.chatbot-window');
  const closeBtn = document.querySelector('.chatbot-close');
  const body = document.getElementById('chatbotBody');
  const input = document.getElementById('chatbotInput');
  const sendBtn = document.getElementById('chatbotSend');

  // Toggle chat
  const toggleChat = () => chatWindow.classList.toggle('is-open');
  toggler.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', () => chatWindow.classList.remove('is-open'));

  // Q&A Database based on portfolio contents
  const qaDatabase = [
    {
      keywords: ['name', 'who are you', 'who is this'],
      answer: "I am an AI assistant representing Sarbeswar Panda (also known as Kahna). I can answer questions about his portfolio!"
    },
    {
      keywords: ['role', 'what do you do', 'profession', 'job', 'developer'],
      answer: "Sarbeswar is an AI/ML Engineer, Full Stack Developer, and Computer Science student specializing in Artificial Intelligence."
    },
    {
      keywords: ['location', 'where are you from', 'city', 'country', 'belong'],
      answer: "Sarbeswar is from Nayagarh, Odisha, India, and currently lives in Bhubaneswar."
    },
    {
      keywords: ['contact', 'email', 'phone', 'call', 'reach', 'number', 'hire'],
      answer: "You can reach Sarbeswar via email at [sarbeswarpanda143@gmail.com](mailto:sarbeswarpanda143@gmail.com) or call him at +91-8260916384."
    },
    {
      keywords: ['education', 'college', 'school', 'study', 'degree', 'btech', 'cgpa', 'university'],
      answer: "Sarbeswar is pursuing B.Tech in Computer Science & Engineering (AI) at GIFT Autonomous College with a CGPA of 7.86. He completed Intermediate Science from Nayagarh Autonomous College (63%) and Matriculation from Kabiraj Baidyanath High School (83%)."
    },
    {
      keywords: ['experience', 'internship', 'work', 'company', 'ardent', 'intern', 'machine learning internship'],
      answer: "Sarbeswar completed two internships at Ardent Computech Pvt. Ltd., Kolkata, as a Data Science & AI/ML Intern. He gained practical experience in data preprocessing, predictive analytics, machine learning model development, and evaluation."
    },
    {
      keywords: ['skills', 'technology', 'tech stack', 'programming', 'coding skills'],
      answer: "His technical skills include HTML, CSS, JavaScript, Python, Java, C, C++, MongoDB, Firebase, Git, GitHub, Pandas, Machine Learning, Data Preprocessing, and API Integration."
    },
    {
      keywords: ['tools', 'software', 'editor', 'development tools'],
      answer: "Sarbeswar commonly uses VS Code, Git, GitHub, Postman, Firebase, MongoDB, Vercel, Jupyter Notebook, and various AI/ML libraries."
    },
    {
      keywords: ['projects', 'project', 'build', 'created', 'made'],
      answer: "Sarbeswar has developed multiple projects in AI, Machine Learning, Full Stack Development, and Web Applications. Visit the Projects section to explore them."
    },
    {
      keywords: ['portfolio', 'website', 'personal website', 'site'],
      answer: "This portfolio showcases Sarbeswar's projects, experience, certifications, achievements, skills, and professional journey."
    },
    {
      keywords: ['freestream', 'streaming platform', 'live tv', 'ott'],
      answer: "FreeStream is a production-grade live TV streaming platform built by Sarbeswar that provides access to 639+ live channels across various categories and languages."
    },
    {
      keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'aiml'],
      answer: "Sarbeswar specializes in Artificial Intelligence and Machine Learning and actively works on predictive analytics, data science, and intelligent software solutions."
    },
    {
      keywords: ['current', 'student', 'year', 'semester', 'currently doing'],
      answer: "Sarbeswar is currently a 3rd-year B.Tech Computer Science student specializing in Artificial Intelligence."
    },
    {
      keywords: ['github profile', 'github account', 'repositories', 'source code'],
      answer: "You can explore Sarbeswar's coding projects and repositories through his GitHub profile linked in the website."
    },
    {
      keywords: ['certificate', 'certification', 'courses completed'],
      answer: "Sarbeswar has completed certifications in AI, Machine Learning, Data Science, Programming, and Web Development."
    },
    {
      keywords: ['interests', 'technology interests', 'favorite technologies'],
      answer: "His primary interests include Artificial Intelligence, Machine Learning, Full Stack Development, Software Engineering, and Problem Solving."
    },
    {
      keywords: ['soft skills', 'communication', 'teamwork', 'leadership'],
      answer: "Sarbeswar values communication, teamwork, leadership, adaptability, time management, and continuous learning."
    },
    {
      keywords: ['problem solving', 'dsa', 'data structures', 'algorithms'],
      answer: "He actively practices Data Structures, Algorithms, and coding challenges to improve analytical and problem-solving skills."
    },
    {
      keywords: ['available', 'freelance', 'collaboration', 'work together'],
      answer: "Sarbeswar is open to internships, freelance projects, collaborations, and professional networking opportunities."
    },
    {
      keywords: ['strength', 'strong points', 'best qualities'],
      answer: "His strengths include self-learning, discipline, adaptability, consistency, problem-solving, and dedication toward continuous improvement."
    },
    {
      keywords: ['goal', 'career goal', 'future plan', 'dream company', 'ambition'],
      answer: "Sarbeswar aims to become a highly skilled AI/ML Engineer and Full Stack Developer while contributing to impactful technology solutions."
    },
    {
      keywords: ['social', 'linkedin', 'github', 'instagram', 'twitter', 'x', 'peerlist', 'follow'],
      answer: "You can connect with Sarbeswar through LinkedIn, GitHub, Instagram, X (Twitter), and Peerlist using the links available on this website."
    },
    {
      keywords: ['about', 'mindset', 'tell me about yourself'],
      answer: "Sarbeswar is a self-motivated learner who believes in hard work, consistency, and lifelong learning. He enjoys building real-world projects and solving challenging problems."
    },
    {
      keywords: ['dob', 'date of birth', 'age', 'born', 'birthday'],
      answer: "Sarbeswar was born on 10 August 2005."
    },
    {
      keywords: ['parents', 'father', 'mother', 'family'],
      answer: "His father is Mr. Parikshita Panda and his mother is Mrs. Jhunarani Panda."
    },
    {
      keywords: ['resume', 'cv', 'download', 'pdf'],
      answer: "You can download Sarbeswar's latest resume from the Resume button available on the website."
    },
    {
      keywords: ['language', 'languages known', 'speak', 'hindi', 'odia', 'english'],
      answer: "Sarbeswar can communicate effectively in English, Hindi, and Odia."
    },
    {
      keywords: ['hire you', 'why hire', 'recruit', 'job opportunity'],
      answer: "Sarbeswar combines AI/ML expertise, full-stack development skills, problem-solving ability, and a strong learning mindset, making him a valuable addition to technology teams."
    },
    {
      keywords: ['fun fact', 'interesting fact', 'something unique'],
      answer: "Sarbeswar enjoys exploring new technologies, building innovative projects, and continuously upgrading his skills through hands-on learning."
    },
    {
      keywords: ['hi', 'hello', 'hey', 'greetings', 'namaste'],
      answer: "Hello! 👋 Welcome to Sarbeswar's portfolio. Ask me anything about his skills, projects, experience, certifications, or contact information."
    },
    {
      keywords: ['bye', 'goodbye', 'see you', 'thanks', 'thank you'],
      answer: "You're welcome! Feel free to explore the portfolio and connect with Sarbeswar anytime. Have a great day!"
    }

  ];

  // Helper to add message
  const addMessage = (text, sender, isHTML = false) => {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chatbot-message', sender);
    if (isHTML) {
      msgDiv.innerHTML = text;
    } else {
      msgDiv.textContent = text;
    }
    body.appendChild(msgDiv);
    body.scrollTop = body.scrollHeight;
  };

  // Bot Logic
  const getBotResponse = (inputMsg) => {
    const text = inputMsg.toLowerCase();

    let bestMatch = null;
    let maxMatches = 0;

    for (const qa of qaDatabase) {
      let matches = 0;
      for (const kw of qa.keywords) {
        // use regex or simple includes for matching
        const regex = new RegExp('\\b' + kw + '\\b', 'i');
        if (regex.test(text)) {
          matches++;
        }
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = qa;
      }
    }

    // Fallback simple includes if regex bounded by word boundary failed but part of word matched
    if (!bestMatch) {
      for (const qa of qaDatabase) {
        let matches = 0;
        for (const kw of qa.keywords) {
          if (text.includes(kw)) {
            matches++;
          }
        }
        if (matches > maxMatches) {
          maxMatches = matches;
          bestMatch = qa;
        }
      }
    }

    if (bestMatch) {
      return bestMatch.answer;
    } else {
      return "I'm sorry, I couldn't understand your question. Please try asking about Sarbeswar's 'skills', 'experience', 'projects', 'education', or 'contact'.";
    }
  };

  const handleSend = () => {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    // Simulate thinking delay
    setTimeout(() => {
      const response = getBotResponse(text);
      addMessage(response, 'bot', true);
    }, 500);
  };

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

})();