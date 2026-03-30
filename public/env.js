window.env = {
    base_url: 'https://api.bac.demego.vn',
    //oauth login
    clients: [
        {
            client_id: "demego.user",
            client_secret: "g2RAXgZenebyybWmmfyDWprGhxe5CLAJ",
            scope: 'openid profile offline_access',
            title: "Nhân viên"
        },
        {
            client_id: "tenant.manager",
            client_secret: "g2RAXgZenebyybWmmfyDWprGhxe5CLAJ",
            scope: 'openid profile offline_access',
            title: "Quản lý"
        }
        
    ],
    
    oidc_providers: [
        {
            provider: "demego-idp",
            provider_name: "Super Admin",
            clientId: "demego.user",
        }
    ],
    //web push
    PublicVapidKey: "BKi3dJK8IiwbY2QqFZDJ7hOA5Yus7PpkS7kVNH0zvMBQ_h51soB1OLCYu108W7530hXoU8Lp-g8BmkwZUMvar-Y"
};