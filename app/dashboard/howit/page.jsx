import Head from "next/head";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HowItWorks = () => {
  return (
    <>
      <Head>
        <title>How It Works - AI Mock Interview</title>
        <meta
          name="description"
          content="Learn how our AI Mock Interview works."
        />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-100 to-pink-100 rounded-xl py-16 px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl p-10 ">
          <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-12 drop-shadow-lg">
            How It Works
          </h1>
          <section className="space-y-10">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem
                value="item-1"
                className="border border-gray-300 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="bg-indigo-100 hover:bg-indigo-200 px-4 py-3 focus:outline-none">
                  <h2 className="text-2xl font-semibold text-gray-700">
                    Step 1: Prepare for the Interview
                  </h2>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-5 border-t border-gray-300 bg-white">
                  <p className="text-lg text-gray-600">
                    Get ready by selecting the type of interview and providing
                    some details about the job position.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-2"
                className="border border-gray-300 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="bg-indigo-100 hover:bg-indigo-200 px-4 py-3 focus:outline-none">
                  <h2 className="text-2xl font-semibold text-gray-700">
                    Step 2: Start the AI Interview
                  </h2>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-5 border-t border-gray-300 bg-white">
                  <p className="text-lg text-gray-600">
                    Our AI will ask you a series of questions and evaluate your
                    responses in real-time.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-3"
                className="border border-gray-300 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="bg-indigo-100 hover:bg-indigo-200 px-4 py-3 focus:outline-none">
                  <h2 className="text-2xl font-semibold text-gray-700">
                    Step 3: Receive Feedback
                  </h2>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-5 border-t border-gray-300 bg-white">
                  <p className="text-lg text-gray-600">
                    Get detailed feedback on your performance, including
                    strengths and areas for improvement.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </main>
    </>
  );
};

export default HowItWorks;
