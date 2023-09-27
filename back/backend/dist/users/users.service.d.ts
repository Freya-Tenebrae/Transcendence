export declare class User {
    userId: any;
    username: any;
    password: any;
}
export declare class UsersService {
    private readonly users;
    findOne(username: string): Promise<User | undefined>;
}
