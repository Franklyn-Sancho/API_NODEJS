import { UserRepository } from "../repository/UserRepository";
import { createHash } from "../utils/hashUtils";

export class AuthService {
  constructor(
    private userRepository: UserRepository) {}

  async register(email: string, password: string) {
    console.log("O serviço está rodando")
    const hashedPassword = createHash(password);
    await this.userRepository.insertUser(email, hashedPassword);
  }

  async authenticate(email: string, password: string) {
    const user = await this.userRepository.getUser(email);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    const hashedPassword = createHash(password);
    if (user.password !== hashedPassword) {
      throw new Error("Senha incorreta");
    }

    return user;
  }
}
