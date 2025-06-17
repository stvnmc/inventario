export const getInfoCalendar = async (month, day) => {
  const formerPromise = getDaysMonth("former", month, day);
  const currentPromise = getDaysMonth("current", month, day);

  const [former, current] = await Promise.all([formerPromise, currentPromise]);

  let next;

  if (current.length + former.length > 34) {
    next = getDaysMonth("next", month, day).reverse().slice(7).reverse();
  } else {
    next = getDaysMonth("next", month, day);
  }

  const calendarInfo = [...former, ...current, ...next];
  return calendarInfo;
};

const getDaysMonth = (type, month, day) => {
  const idAdjustment = (e) => {
    if (e === "date") {
      return type === "next"
        ? parseInt(month) + 1
        : type === "former"
        ? month - 1
        : month;
    }
    if (e === "day") {
      return type === "next"
        ? month
        : type === "former"
        ? parseInt(month) - 2
        : month - 1;
    }
  };

  const daysInMonth = new Date(day, idAdjustment("date"), 0).getDate();
  const firstDayOfMonth = new Date(day, idAdjustment("day"), 1).getDay();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => ({
    type: type,
    dayNumber: i + 1,
    dayOfWeek: (firstDayOfMonth + i) % 7,
  }));

  if (type === "next") {
    const reversedArrayNext = daysArray;
    let extractedArrayNext = [];
    let i = 0;
    for (const day of reversedArrayNext) {
      extractedArrayNext.push(day);
      if (day.dayOfWeek === 6 && ++i === 2) break;
    }
    return extractedArrayNext;
  }

  if (type === "former") {
    const reversedArray = daysArray.slice().reverse();
    let extractedArray = [];
    for (const day of reversedArray) {
      if (day.dayOfWeek === 6) break;
      extractedArray.unshift(day);
      if (day.dayOfWeek === 0) break;
    }
    return extractedArray;
  }

  return daysArray;
};
