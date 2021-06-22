const Labels = {
  caption: {
    error: 'Oops 🥵',
    success: 'Yahoo! 🤩',
    info: 'FYI 🚨'
  },
  login: {
    error: 'Your username or password is incorrect',
    success: 'You have been successfully logged in',
    robot: 'You might be a robot'
  },
  register: {
    success: 'Registration completed successfully',
    wrongTokenFormat: 'Wrong token format',
    tokenAlreadyUsed: 'Token already used',
    successRequest: 'Request was send successfully.\nConfirm your account by clicking the link sent to your email',
    successCreatingStaff: 'Request was sent successfully.\nPlease tell the staffer to check his email',
    error: 'Something went wrong with your registration'
  },
  password: {
    successFirstPassword: 'Your password was set and the registration is completed',
    successfulRequestResetPassword: 'Link to reset the password was sent to your email',
    successfulResetPassword: 'Your new password was set',
    successfulChangePassword: 'Your password was changed successfully'
  },
  editProfile: {
    successfulStatusChange: 'Status was changed successfully',
    successfulEditStaffer: 'The information of the staffer was changed successfully',
    successfulEditCustomer: 'Your information was updated successfully'
  },
  cart: {
    wrongFormatUUID: 'The added id is not a UUID',
    successfulAddingToCart: 'The item was successfully added to your cart',
    successfulRemovingFromCart: 'The item was successfully removed from your cart',
    errorRemovingFromEmptyCart: 'Cannot remove item from empty cart',
    errorRemovingItemIfCartDoesntHaveIt: 'Cannot remove item from cart where the item is abscent',
    errorRemoveNegativeQuantity: 'Cannot remove negative quantity',
    outOfStock: 'This product is temporary not available!',
    cartIsCorrupted: 'Your cart is corrupted',
    successfulReservationMade: 'Your reservation was made successfully',
    successfulReservationRemoved: 'Your reservation was removed successfully'
  },
  checkout: {
    successfulOrderMade: 'Your order was made successfully'
  },
  comparison: {
    alreadyInTheList: 'This item is already in the list',
    listIsMaxedOut: 'The comparison list is maxed out',
    itemAdded: 'The item was added to your comparison list',
    itemRemoved: 'The item was removed from your comparison list'
  },
  product:{
    successfulCreationProduct: 'Creation new product completed successfully',
    errorCreationProduct: 'Something went wrong with creation product',
    successfulUpdatingProductPicture: 'Picture successfully updated (it may take a while for the picture to update).',
    errorUpdatingProductPicture: 'Could not change the picture, the file must be in the "png" format, weigh no more than 1MB and the extension is 512 x 512',
    successfulUpdatingProduct: 'Successfully updated',
    errorUpdatingProduct: 'Incorrect data for updating please recheck',
    successfulAddingToCart: 'The item was successfully added to your cart',
    successfulRemovingFromCart: 'The item was successfully removed from your cart',
    errorRemovingFromEmptyCart: 'Cannot remove item from empty cart',
    errorRemovingItemIfCartDoesntHaveIt: 'Cannot remove item from cart where the item is abscent',
    errorRemoveNegativeQuantity: 'Cannot remove negative quantity',
    successfulActivateProduct: 'Product successfully activated/deactivated',
  },
  discount:{
    successfulCreationDiscount: 'Discount successfully created',
    errorCreationDiscount: 'Incorrect data for new Discount',
  },
  auction: {
    successfulCreationAuction: 'Auction was successfully created'
  }
}

export default Labels;
