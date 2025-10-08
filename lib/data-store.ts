// In-memory data store for MVP
// In production, this would be replaced with a real database

import { Question, Session, User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

class DataStore {
  private questions: Map<string, Question> = new Map();
  private sessions: Map<string, Session> = new Map();
  private users: Map<string, User> = new Map();
  private usersByEmail: Map<string, User> = new Map();

  constructor() {
    // Initialize with default users
    this.seedUsers();
  }

  private async seedUsers() {
    // Admin user
    const adminId = uuidv4();
    const admin: User = {
      id: adminId,
      email: "admin@levelup.azure",
      passwordHash: await bcrypt.hash("admin123", 10),
      createdAt: new Date().toISOString(),
      role: "admin",
    };
    this.users.set(adminId, admin);
    this.usersByEmail.set(admin.email, admin);

    // Demo user for quick access
    const demoId = uuidv4();
    const demo: User = {
      id: demoId,
      email: "demo@levelup.azure",
      passwordHash: await bcrypt.hash("demo123", 10),
      createdAt: new Date().toISOString(),
      role: "user",
    };
    this.users.set(demoId, demo);
    this.usersByEmail.set(demo.email, demo);
  }

  // ===== USERS =====
  async createUser(email: string, password: string, role: "user" | "admin" = "user"): Promise<User> {
    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = {
      id: userId,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      role,
    };
    this.users.set(userId, user);
    this.usersByEmail.set(email, user);
    return user;
  }

  getUserByEmail(email: string): User | undefined {
    return this.usersByEmail.get(email);
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  // ===== QUESTIONS =====
  addQuestion(question: Question): void {
    this.questions.set(question.id, question);
  }

  addQuestions(questions: Question[]): void {
    questions.forEach((q) => this.addQuestion(q));
  }

  getQuestion(id: string): Question | undefined {
    return this.questions.get(id);
  }

  getAllQuestions(): Question[] {
    return Array.from(this.questions.values());
  }

  getPublishedQuestions(examId?: string): Question[] {
    return Array.from(this.questions.values()).filter(
      (q) => q.status === "published" && (!examId || q.examId === examId)
    );
  }

  getQuestionsByObjective(objectiveId: string, examId?: string): Question[] {
    return this.getPublishedQuestions(examId).filter((q) => q.objectiveId === objectiveId);
  }

  getQuestionsByDifficulty(difficulty: string, examId?: string): Question[] {
    return this.getPublishedQuestions(examId).filter((q) => q.difficulty === difficulty);
  }

  updateQuestion(id: string, updates: Partial<Question>): Question | null {
    const question = this.questions.get(id);
    if (!question) return null;
    const updated = { ...question, ...updates, lastUpdated: new Date().toISOString() };
    this.questions.set(id, updated);
    return updated;
  }

  deleteQuestion(id: string): boolean {
    return this.questions.delete(id);
  }

  // ===== SESSIONS =====
  createSession(session: Session): void {
    this.sessions.set(session.id, session);
  }

  getSession(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  updateSession(id: string, updates: Partial<Session>): Session | null {
    const session = this.sessions.get(id);
    if (!session) return null;
    const updated = { ...session, ...updates };
    this.sessions.set(id, updated);
    return updated;
  }

  getUserSessions(userId: string): Session[] {
    return Array.from(this.sessions.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }

  getCompletedSessions(userId: string): Session[] {
    return this.getUserSessions(userId).filter((s) => s.completedAt);
  }

  // ===== COVERAGE =====
  getCoverage(examId: string) {
    const questions = Array.from(this.questions.values()).filter((q) => q.examId === examId);
    const objectives = new Map<string, { published: number; draft: number }>();

    questions.forEach((q) => {
      if (!objectives.has(q.objectiveId)) {
        objectives.set(q.objectiveId, { published: 0, draft: 0 });
      }
      const obj = objectives.get(q.objectiveId)!;
      if (q.status === "published") {
        obj.published++;
      } else {
        obj.draft++;
      }
    });

    const objectiveArray = Array.from(objectives.entries()).map(([objectiveId, counts]) => ({
      objectiveId,
      published: counts.published,
      draft: counts.draft,
      total: counts.published + counts.draft,
    }));

    return {
      examId,
      objectives: objectiveArray,
      totalPublished: objectiveArray.reduce((sum, obj) => sum + obj.published, 0),
      totalDraft: objectiveArray.reduce((sum, obj) => sum + obj.draft, 0),
    };
  }

  // ===== STATS =====
  getWeakCategories(userId: string, limit: number = 3) {
    const sessions = this.getCompletedSessions(userId);
    const categoryStats = new Map<string, { correct: number; total: number }>();

    sessions.forEach((session) => {
      if (session.perCategoryAccuracy) {
        Object.entries(session.perCategoryAccuracy).forEach(([category, stats]) => {
          if (!categoryStats.has(category)) {
            categoryStats.set(category, { correct: 0, total: 0 });
          }
          const existing = categoryStats.get(category)!;
          existing.correct += stats.correct;
          existing.total += stats.total;
        });
      }
    });

    return Array.from(categoryStats.entries())
      .map(([category, stats]) => ({
        category,
        accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
        total: stats.total,
      }))
      .filter((item) => item.total > 0)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, limit);
  }
}

// Singleton instance
export const dataStore = new DataStore();
