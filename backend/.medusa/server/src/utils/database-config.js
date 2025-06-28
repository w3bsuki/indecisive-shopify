"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const getDatabaseConfig = () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is required');
    }
    const url = new URL(process.env.DATABASE_URL);
    // Add pooling parameters to connection string
    const poolParams = [
        'pool_min=2',
        'pool_max=10',
        'pool_timeout=60000',
        'idle_timeout=30000',
        'connect_timeout=10000'
    ].join('&');
    // Append pool parameters
    const separator = url.search ? '&' : '?';
    const pooledUrl = `${process.env.DATABASE_URL}${separator}${poolParams}`;
    return {
        url: pooledUrl,
        options: {
            logging: process.env.NODE_ENV !== 'production',
            ssl: process.env.NODE_ENV === 'production'
                ? { rejectUnauthorized: false }
                : false
        }
    };
};
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWJhc2UtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3V0aWxzL2RhdGFiYXNlLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBTyxNQUFNLGlCQUFpQixHQUFHLEdBQUcsRUFBRTtJQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFOUMsOENBQThDO0lBQzlDLE1BQU0sVUFBVSxHQUFHO1FBQ2pCLFlBQVk7UUFDWixhQUFhO1FBQ2Isb0JBQW9CO1FBQ3BCLG9CQUFvQjtRQUNwQix1QkFBdUI7S0FDeEIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFWix5QkFBeUI7SUFDekIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDekMsTUFBTSxTQUFTLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxTQUFTLEdBQUcsVUFBVSxFQUFFLENBQUM7SUFFekUsT0FBTztRQUNMLEdBQUcsRUFBRSxTQUFTO1FBQ2QsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVk7WUFDOUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVk7Z0JBQ3hDLENBQUMsQ0FBQyxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRTtnQkFDL0IsQ0FBQyxDQUFDLEtBQUs7U0FDVjtLQUNGLENBQUM7QUFDSixDQUFDLENBQUM7QUE3QlcsUUFBQSxpQkFBaUIscUJBNkI1QiJ9