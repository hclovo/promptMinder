import { db } from '@/server/db/db';
import { tags } from '@/server/db/schema';
import { eq, desc, and } from "drizzle-orm";

export class TagService {
    static async getTagsByUserId(params: {
        userId?: string;
      }) {
        try {
            const result = await db
                .select()
                .from(tags)
                .where(and(
                    eq(tags.userId, params.userId),
                    eq(tags.userId, null)
                ))
                .execute();
                return {status: true, data: result || null, error: null};
        } catch (error) {
            return {status: false, data: null, error: error.message};
        }
    }
    static async getAllTags() {
        try {
            const result = await db
                .select()
                .from(tags)
                .execute();
            
            // 转换字段名格式，确保与前端一致
            const processedResult = result.map(item => ({
                ...item,
                created_at: item.createdAt,
                updated_at: item.updatedAt
            }));
            
            return {status: true, data: processedResult || null, error: null};
        } catch (error) {
            return {status: false, data: null, error: error.message};
        }
    }

    // 新增一个标签
    static async createTag(params: {
        name?: string;
      }) {
        try {
            if (!params.name) {
                throw new Error('Missing userId or name');
            }
            const result = await db
                .insert(tags)
                .values({
                    id: crypto.randomUUID(),
                    userId: null,
                    name: params.name,
                    createdAt: new Date()
                })
                .execute();
            return {status: true, data: result || null, error: null};
        } catch (error) {
            return {status: false, data: null, error: error.message};
        }
    }

    // 根据id修改标签
    static async updateTagById(params: {
        id?: string;
        name?: string;
      }) {
        try {
            if (!params.id || !params.name) {
                throw new Error('Missing id or name');
            }
            const result = await db
                .update(tags)
                .set({
                    name: params.name,
                    updatedAt: new Date()
                })
                .where(and(
                    eq(tags.id, params.id)
                ))
                .execute();
            return {status: true, data: result || null, error: null};
        } catch (error) {
            return {status: false, data: null, error: error.message};
        }
    }

    static async deleteTagById(params: {
        id?: string;
      }) {
        try {
            if (!params.id) {
                throw new Error('Missing id');
            }
            const result = await db
                .delete(tags)
                .where(and(
                    eq(tags.id, params.id)
                ))
                .execute();
            return {status: true, error: null};
        } catch (error) {
            return {status: false, error: error.message};
        }
    }

    // 根据id获取标签
    static async getTagById(params: {
        id?: string;
      }) {
        try {
            if (!params.id) {
                throw new Error('Missing id');
            }
            const result = await db
                .select()
                .from(tags)
                .where(and(
                    eq(tags.id, params.id)
                ))
                .execute();
            
            const tag = result[0];
            if (tag) {
                // 转换字段名格式，确保与前端一致
                const processedTag = {
                    ...tag,
                    created_at: tag.createdAt,
                    updated_at: tag.updatedAt
                };
                return {status: true, data: processedTag, error: null};
            }

            return {status: true, data: null, error: null};
        } catch (error) {
            return {status: false, data: null, error: error.message};
        }
    }
}