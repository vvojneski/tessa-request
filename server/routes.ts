import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubmissionSchema } from "@shared/schema";
import { api } from "@shared/routes";
import { z } from "zod";

// Helper for formatting notifications
function formatSubmissionSummary(sub: any) {
  return `
📢 *New Penetration Test Request*

*Contact:* ${sub.contactName} (${sub.contactEmail})
*Business Req:* ${sub.businessRequirement}
*Test Types:* ${sub.testTypes.join(", ")}
*Target Type:* ${sub.targetType} ${sub.targetOther ? `(${sub.targetOther})` : ""}
*Production:* ${sub.isProduction ? "⚠️ YES" : "No"}

*Scope:*
${sub.scopeDescription}

*Assets:*
${sub.inScopeAssets}
  `.trim();
}

async function sendNotifications(submission: any) {
  const summary = formatSubmissionSummary(submission);
  
  // 1. Slack Notification
  if (process.env.SLACK_WEBHOOK_URL) {
    try {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: summary })
      });
      console.log("Slack notification sent");
    } catch (err) {
      console.error("Failed to send Slack notification:", err);
    }
  } else {
    console.log("Mock Slack Notification:\n", summary);
  }

  // 2. Email Notification (Mock implementation - would use Nodemailer/SendGrid here)
  if (process.env.SMTP_HOST) {
    // Implement actual email sending here
    console.log("Email sending configured but not fully implemented in this demo.");
  } else {
    console.log("Mock Email Notification to configured recipients.");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.submissions.create.path, async (req, res) => {
    try {
      const data = insertSubmissionSchema.parse(req.body);
      const submission = await storage.createSubmission(data);
      
      // Trigger async notifications
      sendNotifications(submission).catch(err => console.error("Notification error:", err));

      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation failed", errors: error.errors });
      } else {
        console.error("Submission error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get(api.submissions.list.path, async (req, res) => {
    // In a real app, protect this with auth!
    const submissions = await storage.getSubmissions();
    res.json(submissions);
  });

  return httpServer;
}
