"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import useSpeechToText from "react-hook-speech-to-text";
import React, { useContext, useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import { Mic, WebcamIcon } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { WebCamContext } from "@/app/dashboard/layout";
import { GoogleGenerativeAI } from "@google/generative-ai";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      updateUserAnswer();
    }
  }, [userAnswer]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await transcribeAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast(
        "Error starting recording. Please check your microphone permissions."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      setLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Convert audio blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(",")[1];

        const result = await model.generateContent([
          "Transcribe the following audio:",
          { inlineData: { data: base64Audio, mimeType: "audio/webm" } },
        ]);

        const transcription = result.response.text();
        setUserAnswer((prevAnswer) => prevAnswer + " " + transcription);
        setLoading(false);
      };
    } catch (error) {
      console.error("Error transcribing audio:", error);
      toast("Error transcribing audio. Please try again.");
      setLoading(false);
    }
  };

  const updateUserAnswer = async () => {
    try {
      setLoading(true);
      const feedbackPrompt =
        "Question:" +
        mockInterviewQuestion[activeQuestionIndex]?.Question +
        ", User Answer:" +
        userAnswer +
        " , Depending on the question and user answer for given interview question please give us rating(minimum 1 ; maximum 10) for answer and feedback as area of improvement if any in just 3 to 5 lines to improve it in JSON format with rating field and feedback field. (Make sure to be a little lenient in rating)";

      const result = await chatSession.sendMessage(feedbackPrompt);

      let MockJsonResp = result.response.text();
      console.log(MockJsonResp);

      // Removing possible extra text around JSON
      MockJsonResp = MockJsonResp.replace("```json", "").replace("```", "");

      // Attempt to parse JSON
      let jsonFeedbackResp;
      try {
        jsonFeedbackResp = JSON.parse(MockJsonResp);
      } catch (e) {
        throw new Error("Invalid JSON response: " + MockJsonResp);
      }

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.Question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.Answer,
        userAns: userAnswer,
        feedback: jsonFeedbackResp?.feedback,
        rating: jsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("YYYY-MM-DD"),
      });

      if (resp) {
        toast("User Answer recorded successfully");
      }
      setUserAnswer("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast("An error occurred while recording the user answer");
      setLoading(false);
    }
  };

  // const updateUserAnswer = async () => {
  //   try {
  //     setLoading(true);
  //     const feedbackPrompt =
  //       "Question:" +
  //       mockInterviewQuestion[activeQuestionIndex]?.Question +
  //       ", User Answer:" +
  //       userAnswer +
  //       " , Depending on the question and user answer for given interview question please give us rating for answer and feedback as area of improvement if any in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";
  
  //     const result = await chatSession.sendMessage(feedbackPrompt);
  //     let MockJsonResp = result.response.text();
  //     console.log(MockJsonResp);
  
  //     // Removing possible extra text around JSON
  //     MockJsonResp = MockJsonResp.replace("```json", "").replace("```", "");
      
  //     // Attempt to parse JSON
  //     let jsonFeedbackResp;
  //     try {
  //       jsonFeedbackResp = JSON.parse(MockJsonResp);
  //     } catch (e) {
  //       throw new Error("Invalid JSON response: " + MockJsonResp);
  //     }
  
  //     // Update the existing answer instead of inserting a new record
  //     const resp = await db.update(UserAnswer)
  //       .set({
  //         userAns: userAnswer,
  //         feedback: jsonFeedbackResp?.feedback,
  //         rating: jsonFeedbackResp?.rating,
  //       })
  //       .where({
  //         mockIdRef: interviewData?.mockId,
  //         userEmail: user?.primaryEmailAddress?.emailAddress,
  //         question: mockInterviewQuestion[activeQuestionIndex]?.Question,
  //       });
  
  //     if (resp) {
  //       toast("User Answer updated successfully");
  //     }
  //     setUserAnswer("");
  //     setLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //     toast("An error occurred while updating the user answer");
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden">
      {/* Fixed-size webcam container */}
      <div className="flex flex-col justify-center items-center rounded-lg p-5 gap-10 bg-black mt-4 w-[30rem] h-[350px]">
        {webCamEnabled ? (
          <Webcam
            mirrored={true}
            className="w-full h-full"
            style={{ zIndex: 10 }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <WebcamIcon className="h-full w-full text-secondary" />
          </div>
        )}
      </div>
      <div className="md:flex mt-4 md:mt-8 md:gap-5">
        <div className="my-4 md:my-0">
          <Button onClick={() => setWebCamEnabled((prev) => !prev)}>
            {webCamEnabled ? "Close WebCam" : "Enable WebCam"}
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={loading}
        >
          {isRecording ? (
            <h2 className="text-red-400 flex gap-2 ">
              <Mic /> Stop Recording...
            </h2>
          ) : (
            "Record Answer"
          )}
        </Button>
      </div>
    </div>
  );
};

export default RecordAnswerSection;












// "use client";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import React, { useContext, useEffect, useState } from "react";
// import Webcam from "react-webcam";
// import useSpeechToText from "react-hook-speech-to-text";
// import { Mic } from "lucide-react";
// import { toast } from "sonner";
// import { chatSession } from "@/utils/GeminiAIModal";
// import { db } from "@/utils/db";
// import { UserAnswer } from "@/utils/schema";
// import { useUser } from "@clerk/nextjs";
// import moment from "moment";
// import { WebCamContext } from "@/app/dashboard/layout";

// function RecordAnswerSection({
//   mockInterviewQuestion,
//   activeQuestionIndex,
//   interviewData,
// }) {
//   //  {
//   //   mockInterviewQuestion,
//   //   activeQuestionIndex,
//   //   interviewData,
//   // } =>
//   const [userAnswer, setUserAnswer] = useState("");
//   const { user } = useUser();
//   const [loading, setLoading] = useState(false);
//   const {
//     error,
//     interimResult,
//     isRecording,
//     results,
//     startSpeechToText,
//     stopSpeechToText,
//     setResults,
//   } = useSpeechToText({
//     continuous: true,
//     useLegacyResults: false,
//   });
//   const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);

//   useEffect(() => {
//     results.map((result) =>
//       setUserAnswer((prevAns) => prevAns + result?.transcript)
//     );
//   }, [results]);

//   // const SaveUserAnswer = async () => {
//   //   if (isRecording) {
//   //     setLoading(true);
//   //     stopSpeechToText();
//   //     if (userAnswer?.length < 10) {
//   //       setLoading(false);
//   //       toast("Error while saving your answer,please record again");
//   //       return;
//   //     }
//   //     const feedbackPrompt =
//   //       "Question:" +
//   //       mockInterviewQuestion[activeQuestionIndex]?.Question +
//   //       ", User Answer:" +
//   //       userAnswer +
//   //       " , Depending on question and user answer for given interview question" +
//   //       " please give us rating for answer and feedback as area of improvement if any " +
//   //       "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

//   //     const result = await chatSession.sendMessage(feedbackPrompt);
//   //     const MockJsonResp = result.response
//   //       .text()
//   //       .replace("```json", "")
//   //       .replace("```", "")
//   //       .trim();
//   //     console.log(JSON.parse(MockJsonResp));
//   //     const JsonfeedbackResp = JSON.parse(MockJsonResp);

//   //     const resp=await db.insert(UserAnswer).values({
//   //       mockIdRef: interviewData?.mockId,
//   //       question: mockInterviewQuestion[activeQuestionIndex]?.Question,
//   //       correctAns: mockInterviewQuestion[activeQuestionIndex]?.Answer,
//   //       userAns: userAnswer,
//   //       feedback: JsonfeedbackResp?.feedback,
//   //       rating: JsonfeedbackResp?.rating,
//   //       userEmail: user?.primaryEmailAddress?.emailAddress,
//   //       createdAt: moment().format("YYYY-MM-DD"),
//   //     });
//   //     if (resp) {
//   //       toast("User Answer recorded successfully");
//   //     }
//   //     setUserAnswer("");
//   //     setLoading(false);


//   //   } else {
//   //     startSpeechToText();
//   //   }
//   // };

//   useEffect(() => {
//     if (!isRecording && userAnswer.length > 10) {
//       updateUserAnswer();
//     }
//     // if (userAnswer?.length < 10) {
//     //   setLoading(false);
//     //   toast("Error while saving your answer, Please record again");
//     //   return;
//     // }
//   }, [userAnswer]);

//   const StartStopRecording = async () => {
//     if (isRecording) {
//       stopSpeechToText();
//     } else {
//       startSpeechToText();
//     }
//   };

//   const updateUserAnswer = async () => {
//     try {
//       console.log(userAnswer);
//       setLoading(true);
//       const feedbackPrompt =
//         "Question:" +
//         mockInterviewQuestion[activeQuestionIndex]?.Question +
//         ", User Answer:" +
//         userAnswer +
//         " , Depends on question and user answer for given interview question" +
//         " please give us rating for answer and feedback as area of improvement if any " +
//         "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

//       const result = await chatSession.sendMessage(feedbackPrompt);

//       let MockJsonResp = result.response.text();
//       console.log(MockJsonResp);

//       // Removing possible extra text around JSON
//       MockJsonResp = MockJsonResp.replace("```json", "").replace("```", "");

//       // Attempt to parse JSON
//       let jsonFeedbackResp;
//       try {
//         jsonFeedbackResp = JSON.parse(MockJsonResp);
//       } catch (e) {
//         throw new Error("Invalid JSON response: " + MockJsonResp);
//       }

//       const resp = await db.insert(UserAnswer).values({
//         mockIdRef: interviewData?.mockId,
//         question: mockInterviewQuestion[activeQuestionIndex]?.Question,
//         correctAns: mockInterviewQuestion[activeQuestionIndex]?.Answer,
//         userAns: userAnswer,
//         feedback: jsonFeedbackResp?.feedback,
//         rating: jsonFeedbackResp?.rating,
//         userEmail: user?.primaryEmailAddress?.emailAddress,
//         createdAt: moment().format("YYYY-MM-DD"),
//       });

//       if (resp) {
//         toast("User Answer recorded successfully");
//       }
//       setUserAnswer("");
//       setResults([]);
//       setLoading(false);
//     } catch (error) {
//       console.error(error);
//       toast("An error occurred while recording the user answer");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center overflow-hidden">
//       <div className="flex flex-col justify-center items-center rounded-lg p-5 bg-black my-20 gap-10 ">
//         {webCamEnabled ? (
//           <Webcam
//             mirrored={true}
//             style={{ height: 300, width: "100%", zIndex: 10 }}
//           />
//         ) : (
//           <Image
//             src={"/camerafinal.png"}
//             width={200}
//             height={200}
//             className="absolute"
//           />
//         )}
//       </div>
//       <div className="md:flex  mt-4 md:mt-8 md:gap-5">
//         <div className="my-4 md:my-0">
//           <Button
//             // className={`${webCamEnabled ? "w-full" : "w-full"}`}
//             onClick={() => setWebCamEnabled((prev) => !prev)}
//           >
//             {webCamEnabled ? "Close WebCam" : "Enable WebCam"}
//           </Button>
//         </div>
//         {/* <Button
//           variant="outline"
//           className="my-10"
//           // onClick={StartStopRecording}
//           onClick={isRecording ? stopSpeechToText : startSpeechToText}
//           //disabled={loading}
//         >
//           {isRecording ? 
//             <h2 className="text-red-400 flex gap-2 ">
//               <Mic/> Stop Recording
//             </h2>
//           : 
//             'Record Answer'
//           }
//         </Button> */}
//         <Button
//         disabled={loading}
//           variant="outline"
//           className="my-10"
//           onClick={StartStopRecording}
//         >
//           {isRecording ? (
//             <h2 className="text-red-400 flex gap-2">
//               <Mic /> Stop Recording
//             </h2>
//           ) : (
//             "Record Answer"
//           )}
//         </Button>
//         <Button onClick={() => console.log(userAnswer)}>Show User Ans</Button>
//       </div>
//     </div>
//   );
// }

// export default RecordAnswerSection;





// "use client";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import Webcam from "react-webcam";
// import useSpeechToText from "react-hook-speech-to-text";
// import { Mic, StopCircle } from "lucide-react";
// import { toast } from "sonner";
// import { chatSession } from "@/utils/GeminiAIModal";
// import { db } from "@/utils/db";
// import { UserAnswer } from "@/utils/schema";
// import { useUser } from "@clerk/nextjs";
// import moment from "moment";

// const RecordAnswerSection = ({
//   mockInterviewQuestion,
//   activeQuestionIndex,
//   interviewData,
// }) => {
//   const [userAnswer, setUserAnswer] = useState("");
//   const { user } = useUser();
//   const [loading, setLoading] = useState(false);
//   const {
//     error,
//     interimResult,
//     isRecording,
//     results,
//     startSpeechToText,
//     stopSpeechToText,
//     setResults,
//   } = useSpeechToText({
//     continuous: true,
//     useLegacyResults: false,
//   });
//   useEffect(() => {
//     results.map((result) =>
//       setUserAnswer((prevAns) => prevAns + result?.transcript)
//     );
//   }, [results]);

//   useEffect(() => {
//     if (!isRecording && userAnswer.length > 10) {
//       UpdateUserAnswer();
//     }
//   }, [userAnswer]);

//   const StartStopRecording = async () => {
//     if (isRecording) {
//       stopSpeechToText();
//       // if (userAnswer?.length < 10) {
//       //   setLoading(false)
//       //   toast("Error while saving your answer,please record again");
//       //   return;
//       // }
//     } else {
//       startSpeechToText();
//     }
//   };

//   const UpdateUserAnswer = async () => {
//     console.log(userAnswer, "########");
//     setLoading(true);
//     const feedbackPrompt =
//       "Question:" +
//       mockInterviewQuestion[activeQuestionIndex]?.question +
//       ", User Answer:" +
//       userAnswer +
//       ",Depends on question and user answer for given interview question " +
//       " please give use rating for answer and feedback as area of improvement if any" +
//       " in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";
//     console.log(
//       "🚀 ~ file: RecordAnswerSection.jsx:38 ~ SaveUserAnswer ~ feedbackPrompt:",
//       feedbackPrompt
//     );
//     const result = await chatSession.sendMessage(feedbackPrompt);
//     console.log(
//       "🚀 ~ file: RecordAnswerSection.jsx:46 ~ SaveUserAnswer ~ result:",
//       result
//     );
//     const mockJsonResp = result.response
//       .text()
//       .replace("```json", "")
//       .replace("```", "");

//     console.log(
//       "🚀 ~ file: RecordAnswerSection.jsx:47 ~ SaveUserAnswer ~ mockJsonResp:",
//       mockJsonResp
//     );
//     const JsonfeedbackResp = JSON.parse(mockJsonResp);
//     const resp = await db.insert(UserAnswer).values({
//       mockIdRef: interviewData?.mockId,
//       question: mockInterviewQuestion[activeQuestionIndex]?.question,
//       correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
//       userAns: userAnswer,
//       feedback: JsonfeedbackResp?.feedback,
//       rating: JsonfeedbackResp?.rating,
//       userEmail: user?.primaryEmailAddress?.emailAddress,
//       createdAt: moment().format("DD-MM-YYYY"),
//     });

//     if (resp) {
//       toast("User Answer recorded successfully");
//       setUserAnswer("");
//       setResults([]);
//     }
//     setResults([]);
//     setLoading(false);
//   };

//   if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;
//   return (
//     <div className="flex justify-cente items-center flex-col">
//       <div className="flex flex-col my-20 justify-center items-center bg-black rounded-lg p-5">
//         <Image
//           src={"/webcam.png"}
//           width={200}
//           height={200}
//           className="absolute"
//           alt="webcam"
//           priority
//         />
//         {/* <Webcam
//           style={{ height: 300, width: "100%", zIndex: 10 }}
//           mirrored={true}
//         /> */}
//       </div>
//       <Button
//         disabled={loading}
//         variant="outline"
//         className="my-10"
//         onClick={StartStopRecording}
//       >
//         {isRecording ? (
//           <h2 className="text-red-600 items-center animate-pulse flex gap-2">
//             <StopCircle /> Stop Recording...
//           </h2>
//         ) : (
//           <h2 className="text-primary flex gap-2 items-center">
//             <Mic /> Record Answer
//           </h2>
//         )}
//       </Button>
//       {/* <Button onClick={() => console.log("------", userAnswer)}>
//         Show User Answer
//       </Button> */}
//     </div>
//   );
// };

// export default RecordAnswerSection;
