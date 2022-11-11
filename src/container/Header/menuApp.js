export const adminMenu = [
	{
		//quản lý người dùng
		name: "Quản lý người dùng",
		menus: [
			{
				name: "Quản lý người dùng",
				link: "/system/user-manage",
			},
			{
				name: "Quản lý CTV",
				link: "/system/collaborator-manage",
			},
		],
	},

     {
          //quản lý Services
          name: "Quản lý Services",
          menus: [
               {
                    name: "Quản lý group-service",
                    link: "/services/manage-group-service",
               },
               {
                    name: "Quản lý service",
                    link: "/services/manage-service",
               },
               {
                    name: "Quản lý optional-service",
                    link: "/services/manage-optional-service",
               },
               {
                    name: "Quản lý extend-optional-service",
                    link: "/services/manage-extend-optional-service",
               },
          ],
     },

          //quản lý Settings
     {
		name: "Settings",
		menus: [
			{
				// quản lý Banner
				name: "Quản lý Banner",
				link: "/settings/manage-banner",
			},
			{
				// quản lý news
				name: "Quản lý bài viết Guvi",
				link: "/settings/manage-news",
			},
			{
				// quản lý reason
				name: "Quản lý lý do huỷ việc",
				link: "/settings/manage-reason",
			},
		],
	},
      
     //quản lý Push notification
      {
		name: "Quản lý thông báo",
          link: "/notification/manage-notification",
	},
     //quản lý  User system(Admin)
      {
		name: "Quản lý Admin",
          link: "/adminManage/manage-admin",
	},


];
