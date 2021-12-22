export async function sleep(period = 500) {
  return await new Promise(resolve => setTimeout(resolve, period));
}
