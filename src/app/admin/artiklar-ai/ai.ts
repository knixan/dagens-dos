"use server";

import { generateObject, generateText } from "ai";
import { google } from "@ai-sdk/google"; 
import {z}  from "zod";

export async function generateNews(topic: string) {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"), 
    prompt: `Write an article about this topic: ${topic}`,
    tools:{google_search: google.tools.googleSearch({})}
  });

  const {object }   = await generateObject({
    model: google("gemini-2.5-flash"), 
    prompt: `Generate a news article from this : ${text}.
    the title should bea pure string , no markdown.
    the summary should be written in markdown.
    the content should be written in markdown.`,

    schema: z.object({
      headerLine: z.string(),
      summary: z.string(),
      content: z.string(),
    }),
  });
  return object;
}
