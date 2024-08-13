const userData = {
    user: '',
    logout: '',
    authentication: false
}
const varify = (state = userData, action) => {
    switch (action.type) {
        case 'Login': {
            return {
                ...state,
                ...action.payload.user,
                authentication: true

            };
        }
        default: { return state }
    }
}

const data = { user: 'ali', type: 'Login' };
console.log(varify(data));