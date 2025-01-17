"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportLostItem() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    dateFound: '',
    claimQuestions: ['', '', '']
  });
  const router = useRouter();
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...formData.claimQuestions];
    newQuestions[index] = value;
    setFormData(prevData => ({ ...prevData, claimQuestions: newQuestions }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/lost-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/');
      } else {
        console.error('Failed to submit lost item report');
      }
    } catch (error) {
      console.error('Error submitting lost item report:', error);
    }
  };

  if (user?.role !== 'admin') {
    return <p>You must be an admin to access this page.</p>;
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Report Lost Item</CardTitle>
        <CardDescription>Fill in the details of the lost item</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location Found</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateFound">Date Found</Label>
            <Input
              id="dateFound"
              name="dateFound"
              type="date"
              value={formData.dateFound}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Claim Questions</Label>
            {formData.claimQuestions.map((question, index) => (
              <Input
                key={index}
                value={question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                placeholder={`Question ${index + 1}`}
                required
              />
            ))}
          </div>
          <Button type="submit" className="w-full">Submit Report</Button>
        </form>
      </CardContent>
    </Card>
  )
}

