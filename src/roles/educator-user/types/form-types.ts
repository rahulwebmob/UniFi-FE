// Shared TypeScript interfaces for educator form components

export interface EducatorFormData {
  // Step 1: About
  firstName: string
  lastName: string
  email: string
  country: string
  state: string
  
  // Step 2: Qualification
  summary: string
  company: string
  experience: number
  expertise: Array<{ category: string }>
  education: Array<{ degree: string; field: string }>
  certifications: Array<{ name: string; organization: string }>
  
  // Step 3: Links
  linkedinUrl: string
  twitterUrl: string
  youtubeUrl: string
  websiteUrl: string
  otherProfileUrls: Array<{ link: string }>
  
  // Step 4: Documents
  cv: File | null
  video: File | null
  hau: string
  
}