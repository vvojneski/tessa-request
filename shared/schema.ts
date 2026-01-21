import { pgTable, text, serial, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  
  // Section 1: Intro & Test Type
  businessRequirement: text("business_requirement").notNull(), // 'regulatory' | 'proactive'
  testTypes: text("test_types").array().notNull(), // ['black_box', 'white_box', 'social_eng', etc]
  
  // Section 2: Scope & Awareness
  scopeDescription: text("scope_description").notNull(),
  ownerAwareness: text("owner_awareness").notNull(), // Changed from boolean to text to match radio labels
  inScopeAssets: text("in_scope_assets").notNull(), // List of IPs/Apps
  
  // Section 3: Target Definition
  targetType: text("target_type").notNull(), // 'website', 'mobile', 'network', etc
  targetOther: text("target_other"),
  isProduction: boolean("is_production").notNull(),
  
  // Section 4: External Testing Details (JSONB for flexibility)
  externalDetails: jsonb("external_details").$type<{
    hostingProvider?: string;
    cloudInfrastructure?: string;
    webAppCount?: number;
    mobileAppCount?: number;
  }>(),
  
  // Section 5: Internal Testing Details
  internalDetails: jsonb("internal_details").$type<{
    internalIpCount?: number;
    desktopAppCount?: number;
    internalWebAppCount?: number;
    wirelessNetworkCount?: number;
    wirelessBoxType?: string;
  }>(),
  
  // Section 6: Social Engineering
  socialEngineeringDetails: jsonb("social_engineering_details").$type<{
    employeeCount?: number;
    campaignTypes?: string[];
  }>(),
  
  // Section 7: Scheduling
  schedulingPreferences: text("scheduling_preferences").notNull(),
  schedulingOther: text("scheduling_other"),
  
  // Contact & Meta
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

// === SCHEMAS ===
export const insertSubmissionSchema = createInsertSchema(submissions).extend({
  businessRequirement: z.string().min(1, "Please select a business requirement"),
  testTypes: z.array(z.string()).min(1, "Please select at least one testing methodology"),
  scopeDescription: z.string().min(10, "Please provide a more detailed scope description"),
  ownerAwareness: z.string().min(1, "Please confirm owner awareness"),
  inScopeAssets: z.string().min(1, "Please list in-scope assets"),
  targetType: z.string().min(1, "Please select a target type"),
  schedulingPreferences: z.string().min(1, "Please select a scheduling preference"),
  contactName: z.string().min(1, "Full name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
}).omit({ 
  id: true, 
  submittedAt: true 
});

// === TYPES ===
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;

// Detailed types for the JSON columns to help frontend
export type ExternalDetails = NonNullable<Submission["externalDetails"]>;
export type InternalDetails = NonNullable<Submission["internalDetails"]>;
export type SocialEngineeringDetails = NonNullable<Submission["socialEngineeringDetails"]>;
