export const ValidationMessages = {
  email: 'Incorrect email',
  password: 'Password must contain at least one capital letter, lower case letter and number',
  passwordDontMatch: 'Passwords do not match',
  passwordsAreTheSame: 'Your current password and new password are the same',
  firstName: 'First name must be from 2 to 30 characters long',
  lastName: 'Last name must be from 2 to 30 characters long',
  phoneNumber:  'Must be a numeric value from 12 to 16 integers long',
  flat: 'Must be a positive number',
  productName: "The name must be of size between 2 and 30, start with 2 characters, contain only characters, spaces and numbers",
  price: "The price must be between 0.05 and 23 598",
  minPrice: "The price must be not less than 0.05",
  maxPrice: "The price must be not more than 23 598",
  quantity: "Must be greater than 0",
  file: "The file extension should be only '.png', should be less than 1Mb and 512x512 px",
  offeredPriceMin: "The offered price must be greater than 0,05",
  offeredPriceMax: "The offered price must be less than the price of the current product",
  required: "The field can not be empty",
  expansion: "Picture expansion should only be 'png'",
  resolution: "Picture resolution can only be 512 px by 512 px",
  weight: "The file must not weigh more than 1 MB",
  past: "You cannot create a discount for the past tense!",
  id: "Wrong UUID format",
  minRise: "Minimum bid rise is 5$",
  loweringStep: "Minimum lowering step is 5 cents",
  stepPeriod: "Minimum step period is 60 seconds",
  numSteps: "Minimum number of steps is 1",
  timeToBid: "Minimum time to bid is 10 seconds",
  dateTimeInPast: "Your date and time must be in the future",
  quantityAuction: "Auction must offer more than 3 items of the given product",
  priceAuction: "Auction must start at price at least 100$ and no more than $120 567",
  enterValue: "You must enter a value",
  maxQuantity: "the maximum value is 2 147 483 647"
}
