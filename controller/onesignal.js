OneSignal.addSubscriptionObserver((event) => {
  console.log("OneSignal: subscription changed to userId:", event.to.userId);
  if (event.to.userId) {
    dispatch({ type: "SET_DATA", payload: { oneSignalId: event.to.userId } });
  }
});
//one signal check after first time
useEffect(() => {
  saveOneSignalID();
}, []);
const saveOneSignalID = async () => {
  const data = await OneSignal.getDeviceState();
  const player_id = data.userId;
  if (player_id != undefined) {
    dispatch({ type: "SET_DATA", payload: { oneSignalId: player_id } });
  }
};
