const jwtService: any = {
    createUser: async (data: any) => {
        console.warn('jwtService.createUser is not implemented');
        throw new Error('NOT_IMPLEMENTED');
    },
    signInWithEmailAndPassword: async (email: any, password: any) => {
        console.warn('jwtService.signInWithEmailAndPassword is not implemented');
        throw new Error('NOT_IMPLEMENTED');
    },
    signInWithToken: async () => {
        console.warn('jwtService.signInWithToken is not implemented');
        throw new Error('NOT_IMPLEMENTED');
    },
    updateUserData: async (user: any) => {
        console.warn('jwtService.updateUserData is not implemented');
        throw new Error('NOT_IMPLEMENTED');
    }
};

export default jwtService;
