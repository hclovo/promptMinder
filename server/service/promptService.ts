import { db } from '@/server/db/db';
import { prompts } from '@/server/db/schema';
import { eq, desc, and, ilike } from "drizzle-orm";
import { comma } from 'postcss/lib/list';

export class PromptService {
    static async getPromptById(params: {
      id?: string;
    }) {
        try {
            if (!params.id) {
                throw new Error('Missing id');
            }
            const result = await db
                .select()
                .from(prompts)
                .where(and(
                    eq(prompts.id, params.id)
                ))
                .orderBy(desc(prompts.createdAt))
                .execute();

            const prompt = result[0];
            if (prompt) {
                // 转换字段名格式，确保与前端一致
                const processedPrompt = {
                    ...prompt,
                    created_at: prompt.createdAt,
                    updated_at: prompt.updatedAt
                };
                return {status: true, data: processedPrompt};
            }

            return {status: true, data: null};
        } catch (error) {
            console.log(error);
            return {status: false, data: null, error: error.message};
        }
    }

    static async updateIsPublic(params: {
        id?: string;
      }) {
        try {
            if (!params.id) {
                throw new Error('Missing userId or id');
            }
            const result = await db
                .update(prompts)
                .set({
                    isPublic: true,
                    updatedAt: new Date()
                })
                .where(and(
                    eq(prompts.id, params.id)
                ))
                .execute();
                return {status: true, error: null};
        } catch (error) {
            console.error('Error updating isPublic:', error);
            return {status: false, error: error.message};
        }
      }
    
    static async getAllPrompts() {
        try {
            const result = await db
            .select()
            .from(prompts)
            .orderBy(desc(prompts.createdAt))
            .execute();

            // 转换字段名格式，确保与前端一致
            const processedResult = result.map(item => ({
                ...item,
                created_at: item.createdAt,
                updated_at: item.updatedAt
            }));

            return {
            status: true,
            data: processedResult
            };
        } catch (error) {
            return {
            status: false,
            error: error.message
            };
        }
    }
    
    static async deletePromptById(id: string) {
        try {
            await db
            .delete(prompts)
            .where(eq(prompts.id, id))
            .execute();

            return { status: true };
        } catch (error) {
            return {
            status: false,
            error: error.message
            };
        }
    }

    public static async insertPrompt(params: {
        title: string;
        content: string;
        description: string;
        userId: string;
        version: string;
        tags: string;
        coverImg: string;
        isPublic: boolean;
      }) {
        try {
            const result = await db
            .insert(prompts)
            .values({
                id: crypto.randomUUID(),
                title: params.title,
                content: params.content,
                description: params.description,
                userId: params.userId,
                version: params.version,
                tags: params.tags,
                coverImg: params.coverImg,
                isPublic: params.isPublic,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            .returning();
            return { status: true, data: result[0], error: null };
        } catch (error) {
            return {
            status: false,
            error: error.message
            };
        }
    }

    static async updatePrompt(params: {
        id: string;
        updateData: {
            title?: string;
            content?: string;
            description?: string;
            version?: string;
            tags?: string;
            coverImg?: string;
            isPublic?: boolean;
        }
    }) {
        try {
            const result = await db
            .update(prompts)
            .set(params.updateData)
            .where(eq(prompts.id, params.id));
            return { status: true, data: result, error: null };
        } catch (error) {
            return { status: false, data: null, error: error.message };
        }
    }

    static async getPromptByTags(params: {
        tag: string;
    }) {
        try {
            const result = await db
            .select()
            .from(prompts)
            .where(ilike(prompts.tags, `%${params.tag}%`))
            .execute();
            
            // 转换字段名格式，确保与前端一致
            const processedResult = result.map(item => ({
                ...item,
                created_at: item.createdAt,
                updated_at: item.updatedAt
            }));
            
            return { status: true, data: processedResult, error: null };
        } catch (error) {
            return { status: false, data: null, error: error.message };
        }
    }

    static async getPromptVersions(params: {
        title: string;
    }) {
        try {
            const result = await db
            .select()
            .from(prompts)
            .where(and(eq(prompts.title, params.title), eq(prompts.isPublic, true)))
            .orderBy(desc(prompts.createdAt))
            .execute();
            
            // 转换字段名格式，确保与前端一致
            const processedResult = result.map(item => ({
                ...item,
                created_at: item.createdAt,
                updated_at: item.updatedAt
            }));
            
            const version = []
            processedResult.forEach((item) => {
                version.push(item.version);
            })
            // 去除version中的重复元素
            const uniqueVersion = Array.from(new Set(version));
            return { status: true, data: uniqueVersion, error: null };
        } catch (error) {
            return { status: false, data: null, error: error.message };
        }
    }
}
