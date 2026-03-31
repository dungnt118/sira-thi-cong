const firebaseService: any = {
    auth: {
        createUserWithEmailAndPassword: async (email: any, password: any) => {
            console.warn('firebaseService.createUserWithEmailAndPassword is not implemented');
            throw new Error('NOT_IMPLEMENTED');
        }
    }
};

export default firebaseService;
