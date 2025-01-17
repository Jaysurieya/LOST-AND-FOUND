"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type ClaimFormProps = {
  itemName: string;
  questions: string[];
  onSubmit: (answers: string[]) => void;
  onCancel: () => void;
}

export function ClaimForm({ itemName, questions, onSubmit, onCancel }: ClaimFormProps) {
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Claim "{itemName}"</h2>
      <p className="text-sm text-gray-500">Please answer the following questions to verify your ownership:</p>
      
      {questions.map((question, index) => (
        <div key={index} className="space-y-2">
          <Label htmlFor={`question${index}`}>{question}</Label>
          <Input
            id={`question${index}`}
            value={answers[index]}
            onChange={(e) => {
              const newAnswers = [...answers];
              newAnswers[index] = e.target.value;
              setAnswers(newAnswers);
            }}
            required
          />
        </div>
      ))}
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Submit Claim</Button>
      </div>
    </form>
  )
}

