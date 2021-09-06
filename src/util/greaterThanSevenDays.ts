export const isGreaterThanSevenDays = (date: string | undefined): boolean => {
    if(!date)
        return false
    const today = new Date()
    const queryDate = new Date(date)
    const diffTime = Math.abs((today as any) - (queryDate as any));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 7
}