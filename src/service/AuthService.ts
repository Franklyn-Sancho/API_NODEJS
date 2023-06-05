import { UserRepository } from "../repository/UserRepository";
import { createHash } from "../utils/hashUtils";
import crypto from 'crypto'

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  //serviço de registro
  async register(email: string, password: string) {
    console.log('authservice está rodando')
    //! add one salt
    const hashedPassword = createHash(password);
    await this.userRepository.insertUser(email, hashedPassword);
  }

  async authenticate(email: string, password: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error("Credenciais Inválidas");
    }


    const hashedPassword = createHash(password);
    if (user.password !== hashedPassword) {
      throw new Error("Credenciais Inválidas");
    }

    return user;
  }
}
