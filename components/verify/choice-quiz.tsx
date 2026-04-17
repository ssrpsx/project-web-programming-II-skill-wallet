"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { submitQuiz, retryQuiz } from "@/lib/actions/verifications"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import type { ChoiceQuestion } from "@/lib/api/types"

interface ChoiceQuizProps {
  verificationId: string
  questions: ChoiceQuestion[]
}

export function ChoiceQuiz({ verificationId, questions }: ChoiceQuizProps) {
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [submitResult, setSubmitResult] = useState<{
    passed: boolean
    score: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleStartQuiz = () => {
    setQuizStarted(true)
    setSelectedOption(null)
  }

  const handleSelectOption = (option: string) => {
    setSelectedOption(option)
  }

  const handleNext = () => {
    if (selectedOption === null) {
      setError("Please select an option")
      return
    }

    setError(null)
    const newAnswers = [...selectedAnswers, selectedOption]
    setSelectedAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
    } else {
      // Submit quiz
      startTransition(async () => {
        try {
          const result = await submitQuiz(verificationId, newAnswers)
          setSubmitResult({
            passed: result.passed,
            score: result.score,
          })
        } catch (e: unknown) {
          setError((e as Error).message)
        }
      })
    }
  }

  const handleRetry = async () => {
    try {
      await retryQuiz(verificationId)
      setQuizStarted(false)
      setCurrentQuestion(0)
      setSelectedOption(null)
      setSelectedAnswers([])
      setSubmitResult(null)
      setError(null)
      router.refresh()
    } catch (e: unknown) {
      setError((e as Error).message)
    }
  }

  // Intro Screen
  if (!quizStarted) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Quiz Test</h1>
        <p className="text-gray-600 mb-8">
          A series of questions will help you demonstrate your knowledge. Answer
          all questions to complete the assessment.
        </p>
        <Button
          onClick={handleStartQuiz}
          className="bg-black text-white hover:bg-gray-800"
        >
          Start Quiz
        </Button>
      </div>
    )
  }

  // Result Screen
  if (submitResult !== null) {
    const passed = submitResult.passed
    const score = submitResult.score

    return (
      <div className="max-w-md mx-auto text-center py-12">
        <h1 className="text-3xl font-bold mb-2">Result</h1>
        <p className="text-gray-600 mb-4">Score: {Math.round(score)}%</p>
        {passed ? (
          <>
            <p className="text-gray-600 mb-8">
              Congratulations! You have successfully passed the quiz.
            </p>
            <div className="flex justify-center mb-8">
              <CheckCircle2 size={80} className="text-green-500" />
            </div>
            <Button
              onClick={() => {
                window.location.href = "/app/verify"
              }}
              className="bg-black text-white hover:bg-gray-800"
            >
              Continue to Verify Page
            </Button>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-8">
              Your score is below the passing threshold. Please try again.
            </p>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-red-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-red-500">
                  {Math.round(score)}%
                </span>
              </div>
            </div>
            <Button
              onClick={handleRetry}
              disabled={isPending}
              className="bg-black text-white hover:bg-gray-800"
            >
              {isPending ? "Retrying..." : "Try Again"}
            </Button>
          </>
        )}
      </div>
    )
  }

  // Question Screen
  const question = questions[currentQuestion]
  const progress = `${currentQuestion + 1} / ${questions.length}`

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="text-center mb-8">
        <p className="text-gray-500 text-sm font-medium">{progress}</p>
      </div>

      {/* Question */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">{question.question}</h2>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectOption(option)}
            className={`w-full py-3 px-4 border rounded-lg transition text-left font-medium ${
              selectedOption === option
                ? "border-blue-500 bg-blue-50 text-blue-800"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

      {/* Next Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleNext}
          disabled={isPending}
          className="bg-black text-white hover:bg-gray-800"
        >
          {isPending ? "Submitting..." : "Next"}
        </Button>
      </div>
    </div>
  )
}
