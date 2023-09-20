import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
//export type User = any;

export class User {
	userId;
	username;
	// user_surname;
	// user_pseudonym;
	password;
	// OAuth42_link;
	// google_auth_link;
	// user_last_connection;
	// user_path_avatar;
	// user_status;
	// user_score;
	// user_elo;
}

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}