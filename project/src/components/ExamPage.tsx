import { useState, useEffect } from 'react';
import { Timer, Download, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import mammoth from 'mammoth';
import axios from 'axios';

interface Question {
  id: string;
  visited: boolean;
  answered: boolean;
  markedForReview: boolean;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  question: string;
  options: string[];
  correct_answer: string;
  selectedOption: number | null;
}

export default function ExamPage() {
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const { t, i18n } = useTranslation();

  const [Physics, setPhysics] = useState({
    correct: 0,
    wrong: 0,
    unattempted: 30,
  });
  const [Chemistry, setChemistry] = useState({
    correct: 0,
    wrong: 0,
    unattempted: 30,
  });
  const [Mathematics, setMathematics] = useState({
    correct: 0,
    wrong: 0,
    unattempted: 30,
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(10800); // 3 hours in seconds
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:4000/auth/loginup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({ email: "user.email", password: "user.password" , role: "user"}) // Replace with actual email and password
        });

        const data = await response.json();

        if (data.success) {
          console.log("User Data:", data.user); // ✅ User data is received here
          console.log("JWT Token:", data.jwtToken); // ✅ Token received for authentication
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user)); // Optionally store user data in localStorage
        } else {
          console.error("Login failed:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchExtractedText = async () => {
      try {
        const response = await axios.get<{ filename: string; path: string }>('http://localhost:4000/files');
        const { path } = response.data;
        const fileUrl = `http://localhost:4000/${path.replace('\\', '/')}`;
        const fileResponse = await axios.get(fileUrl, { responseType: 'arraybuffer' });

        const arrayBuffer = fileResponse.data as ArrayBuffer;
        const extractedText = await mammoth
          .extractRawText({ arrayBuffer })
          .then((result) => result.value)
          .catch((err) => {
            console.error('Mammoth extraction error:', err);
            return '';
          });

        const cleanstring = extractedText.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
        const parsedQuestions = JSON.parse(cleanstring) as Question[];
        setQuestions(parsedQuestions);
      } catch (error) {
        console.error('Error fetching extracted text:', error);
      }
    };

    fetchExtractedText();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totaltime = 10800;
  const timeused = totaltime - timeLeft;

  const currentQuestionData = questions.find((q) => q.id === String(currentQuestion));

  const handleQuestionClick = (questionId: string) => {
    const questionNumber = Number(questionId);
    setCurrentQuestion(questionNumber);
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, visited: true } : q))
    );
  };

  const handleOptionSelect = (optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === String(currentQuestion)
          ? { ...q, answered: true, selectedOption: optionIndex }
          : q
      )
    );
    if (currentQuestionData) {
      const subject = currentQuestionData.subject;
      const isCorrect =
        optionIndex ===
        currentQuestionData.options.indexOf(currentQuestionData.correct_answer);

      if (subject === 'Physics') {
        setPhysics((prev) => ({
          ...prev,
          correct: isCorrect ? prev.correct + 1 : prev.correct,
          wrong: !isCorrect && optionIndex !== null ? prev.wrong + 1 : prev.wrong,
          unattempted:
            !isCorrect && optionIndex === null ? prev.unattempted + 1 : prev.unattempted,
        }));
      } else if (subject === 'Chemistry') {
        setChemistry((prev) => ({
          ...prev,
          correct: isCorrect ? prev.correct + 1 : prev.correct,
          wrong: !isCorrect && optionIndex !== null ? prev.wrong + 1 : prev.wrong,
          unattempted:
            !isCorrect && optionIndex === null ? prev.unattempted + 1 : prev.unattempted,
        }));
      } else if (subject === 'Mathematics') {
        setMathematics((prev) => ({
          ...prev,
          correct: isCorrect ? prev.correct + 1 : prev.correct,
          wrong: !isCorrect && optionIndex !== null ? prev.wrong + 1 : prev.wrong,
          unattempted:
            !isCorrect && optionIndex === null ? prev.unattempted + 1 : prev.unattempted,
        }));
      }
    }
  };

  const handleNext = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion <= questions.length) {
      setCurrentQuestion(nextQuestion);
      setQuestions((prev) =>
        prev.map((q) => (q.id === String(nextQuestion) ? { ...q, visited: true } : q))
      );
    }
  };

  const handleMarkForReview = (andNext: boolean = false) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === String(currentQuestion) ? { ...q, markedForReview: true } : q
      )
    );
    if (andNext) {
      handleNext();
    }
  };

  const handleClearResponse = () => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === String(currentQuestion)
          ? { ...q, answered: false, selectedOption: null, markedForReview: false }
          : q
      )
    );
  };

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit?')) {
      navigate('/results', {
        state: {
          Physics: Physics,
          Chemistry: Chemistry,
          Mathematics: Mathematics,
          timeused: timeused,
        },
      });
    }
  };

  const handleSubjectClick = (subject: 'Physics' | 'Chemistry' | 'Mathematics') => {
    let startQuestion = 1;
    if (subject === 'Chemistry') {
      startQuestion = 31;
    } else if (subject === 'Mathematics') {
      startQuestion = 61;
    }
    setCurrentQuestion(startQuestion);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  const getQuestionsForSubject = (subject: 'Physics' | 'Chemistry' | 'Mathematics') => {
    if (subject === 'Physics') {
      return questions.slice(0, 30);
    } else if (subject === 'Chemistry') {
      return questions.slice(30, 60);
    } else if (subject === 'Mathematics') {
      return questions.slice(60, 90);
    }
    return [];
  };

  const currentSubject =
    currentQuestion <= 30 ? 'Physics' : currentQuestion <= 60 ? 'Chemistry' : 'Mathematics';
  const questionsForSubject = getQuestionsForSubject(currentSubject);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center h-16">
              <div>
                <div className="bg-white rounded-full p-2">
                  <div className="flex items-center gap-4">
                    <img
                      src="/11.jpg"
                      alt="Educational Book Logo"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <span
                      style={{
                        fontFamily:
                          'Lucida Sans, Lucida Sans Regular, Lucida Grande, Lucida Sans Unicode, Geneva, Verdana, sans-serif',
                      }}
                      className="text-2xl font-bold text-black-600 tracking-wide"
                    >
                      Educating for Better Tomorrow
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-6 h-6" />
              <div>
                <p className="text-sm">
                  Candidate Name:{' '}
                  <span className="font-semibold">
                    {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
                  </span>
                </p>
                <p className="text-sm">
                  Subject: <span className="font-semibold">Test Practice</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded">
              <Timer className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 font-semibold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-orange-500 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-7">
            <span className="font-bold text-xl">JEE MAIN</span>
            <button
              onClick={() => handleSubjectClick('Physics')}
              className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700"
            >
              PHYSICS
            </button>
            <button
              onClick={() => handleSubjectClick('Chemistry')}
              className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700"
            >
              CHEMISTRY
            </button>
            <button
              onClick={() => handleSubjectClick('Mathematics')}
              className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700"
            >
              MATHEMATICS
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span>DOWNLOAD PAPER IN:</span>
            <button className="bg-blue-600 px-4 py-1 rounded flex items-center gap-2 hover:bg-blue-700">
              <Download className="w-4 h-4" />
              {t("DOWNLOAD")}
            </button>
            <select className="bg-white text-gray-800 px-4 py-1 rounded" onChange={handleLanguageChange}>
              <option value="en">English</option>
              
            </select>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex gap-6">
        {/* Question Area */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Question-{currentQuestionData?.id}</h2>
            <button className="text-blue-600">
              <Download className="w-5 h-5" />
            </button>
          </div>

          {/* Single Question Display */}
          {currentQuestionData && (
            <div className="space-y-4">
              <p className="text-lg mb-4">{currentQuestionData.question}</p>
              <div className="space-y-3">
                {currentQuestionData.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-3">
                    <input
                      type="radio"
                      id={`option-${optionIndex}`}
                      name={`question-${currentQuestionData.id}`}
                      className="w-4 h-4"
                      checked={currentQuestionData.selectedOption === optionIndex}
                      onChange={() => handleOptionSelect(optionIndex)}
                    />
                    <label htmlFor={`option-${optionIndex}`} className="text-lg">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 flex flex-col gap-y-2">
            <div className='flex gap-x-3'>
              <button
                onClick={handleNext}
                className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                SAVE & NEXT
              </button>
              <button
                onClick={() => handleMarkForReview(false)}
                className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
              >
                SAVE & MARK FOR REVIEW
              </button>
              <button
                onClick={() => handleMarkForReview(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                MARK FOR REVIEW & NEXT
              </button>
              <button
                onClick={handleClearResponse}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
              >
                CLEAR RESPONSE
              </button>
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentQuestion(prev => prev > 1 ? prev - 1 : prev)}
                className=" bg-gray-200 border border-gray-400 px-4 py-2 rounded hover:bg-gray-300"
              >
                &#8810; BACK
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-8 py-2 rounded hover:bg-green-600"
              >
                SUBMIT
              </button>
              <button
                onClick={handleNext}
                className="bg-gray-200 border border-gray-400 px-4 py-2 rounded hover:bg-gray-300"
              >
                NEXT &#8811;
              </button>
            </div>
          </div>
        </div>

        {/* Question Grid */}
        <div className="w-96 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-8 gap-2">
            {questionsForSubject.map((q) => (
              <button
                key={q.id}
                onClick={() => handleQuestionClick(q.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm
                  ${!q.visited ? 'bg-gray-200' : ''}
                  ${q.visited && !q.answered && !q.markedForReview ? 'bg-red-500 text-white' : ''}
                  ${q.answered && !q.markedForReview ? 'bg-green-500 text-white' : ''}
                  ${q.markedForReview ? 'bg-purple-500 text-white' : ''}
                  ${String(currentQuestion) === q.id ? 'ring-2 ring-blue-500' : ''}
                  hover:ring-2 hover:ring-blue-500 transition-all
                `}
              >
                {q.id}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
              <span className="text-sm">Not Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm">Not Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Marked for Review</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}