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
    successfulAddingToCart: 'The item was successfully added to your cart'
  },
  product:{
    success: 'Creation new product completed successfully',
    error: 'Something went wrong with creation product'
    successfulAddingToCart: 'The item was successfully added to your cart',
    successfulRemovingFromCart: 'The item was successfully removed from your cart',
    errorRemovingFromEmptyCart: 'Cannot remove item from empty cart',
    errorRemovingItemIfCartDoesntHaveIt: 'Cannot remove item from cart where the item is abscent',
    errorRemoveNegativeQuantity: 'Cannot remove negative quantity'
  }
}

export default Labels;
