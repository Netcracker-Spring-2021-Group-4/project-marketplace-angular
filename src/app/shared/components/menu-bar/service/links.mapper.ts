import {Link} from "../../../models/internal/link.model";
import {UserRole} from "../../../models/enums/role.enum";

const mapper = (role: UserRole) => {
  switch (role) {
    case UserRole.ROLE_CUSTOMER: {
      return {
        main: [list[0], list[5]],
        side: [list[7], list[8], list[9], list[10], list[13]]
      }
    }
    case UserRole.ROLE_COURIER: {
      return {
        main: [list[6]],
        side: [list[10], list[13]]
      }
    }
    case UserRole.ROLE_PRODUCT_MGR: {
      return {
        main: [list[0], list[1], list[5], list[2], list[3]],
        side: [list[10], list[13]]
      }
    }
    case UserRole.ROLE_ADMIN: {
      return {
        main: [list[0], list[1], list[5], list[2], list[3], list[4]],
        side: [list[10], list[13]]
      }
    }
    default: {
      return {
        main: [list[0]],
        side: [list[8], list[9], list[11], list[12]]
      }
    }
  }
}

export default mapper;

const getIconClassString = (name: string) => (`fas fa-${name}`);

const list: Link[] = [
  {
    label: "Catalog",
    url: '/'
  },
  {
    label: "Create product",
    url: '/'
  },
  {
    label: "Create auction",
    url: '/'
  },
  {
    label: "Stock",
    url: '/'
  },
  {
    label: "Staff",
    url: '/'
  },
  {
    label: "Auctions",
    url: '/'
  },
  {
    label: "Deliveries",
    url: '/'
  },
  {
    label: 'My orders',
    icon: getIconClassString('history'),
    url: '/'
  },
  {
    label: 'compare',
    icon: getIconClassString('balance-scale'),
    url: '/'
  },
  {
    label: 'Shopping cart',
    icon: getIconClassString('shopping-cart'),
    url: '/'
  },
  {
    label: 'My profile',
    icon: getIconClassString('user'),
    url: '/'
  },
  {
    label: 'Login',
    url: '/'
  },
  {
    label: 'Sign Up',
    url: '/'
  },
  {
    label: 'Logout',
    url: '/'
  }
];
