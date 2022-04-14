
export interface IAuthServiceProvider {
    getUser(code: string): Promise<{
        id: string,
        name: string,
        email: string,
        picture: string
    }> 
}