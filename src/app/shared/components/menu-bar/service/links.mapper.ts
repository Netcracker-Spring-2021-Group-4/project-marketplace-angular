import {Link} from "../../../models/internal/link.model";
import {UserRole} from "../../../models/enums/role.enum";
import {Route} from "../../../models/enums/route.enum";

const mapper = (role: UserRole) => {
  switch (role) {
    case UserRole.ROLE_CUSTOMER: {
      return {
        main: [list[0]],
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
        main: [list[0], list[1], list[2]],
        side: [list[8], list[10], list[13]]
      }
    }
    case UserRole.ROLE_ADMIN: {
      return {
        main: [list[0], list[1], list[2], list[4]],
        side: [list[8], list[13]]
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
    url: Route.CATALOG
  },
  {
    label: "Create product",
    url: Route.CREATE_PRODUCT
  },
  {
    label: "Create auction",
    url: Route.CREATE_AUCTION
  },
  {
    label: "Stock",
    url: Route.STOCK
  },
  {
    label: "Staff",
    url: Route.STAFF_LIST
  },
  {
    label: "Auctions",
    url: Route.AUCTIONS
  },
  {
    label: "Deliveries",
    url: Route.DELIVERIES
  },
  {
    label: 'My orders',
    icon: getIconClassString('history'),
    url: Route.ORDER_HISTORY
  },
  {
    label: 'compare',
    icon: getIconClassString('balance-scale'),
    url: Route.COMPARE
  },
  {
    label: 'Shopping cart',
    icon: getIconClassString('shopping-cart'),
    url: Route.CART
  },
  {
    label: 'My profile',
    icon: getIconClassString('user'),
    url: Route.PROFILE
  },
  {
    label: 'Login',
    url: Route.LOGIN,
  },
  {
    label: 'Sign Up',
    url: Route.REGISTER
  },
  {
    label: 'Logout',
    url: Route.CATALOG
  }
];
