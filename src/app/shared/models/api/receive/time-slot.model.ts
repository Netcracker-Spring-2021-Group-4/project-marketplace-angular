export class TimeSlotModel {
  timeStart: number[]
  timeEnd: number[]
  taken: boolean

  constructor(init: Partial<TimeSlotModel>) {
    Object.assign(this, init);
  }
}


export class TimeSlotModelFront {
  timeStart: number[]
  label: string
  taken: boolean

  constructor(init: Partial<TimeSlotModelFront>) {
    Object.assign(this, init);
  }

  static setFromTimeSlotModel(model: TimeSlotModel): TimeSlotModelFront {
    const label = `${getStringTime(model.timeStart)}`
    return {
      timeStart: model.timeStart,
      taken: model.taken,
      label: `${getStringTime(model.timeStart)}-${getStringTime(model.timeEnd)}`
    }
  }

}

export const getStringTime = (number: number[]): string => {
  return number.map(v => addZero(v)).join(':')
}

const addZero = (number: number): string =>{
  return number < 10? '0'+ number : number.toString()
}
