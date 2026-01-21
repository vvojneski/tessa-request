import { submissions, type Submission, type InsertSubmission } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissions(): Promise<Submission[]>;
}

export class DatabaseStorage implements IStorage {
  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const [submission] = await db
      .insert(submissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  async getSubmissions(): Promise<Submission[]> {
    return await db.select().from(submissions);
  }
}

export const storage = new DatabaseStorage();
