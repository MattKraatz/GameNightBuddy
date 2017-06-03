namespace GameNightBuddy_Server.ViewModels
{
  public class StoreActionViewModel
  {
    public string Type;
    public object Payload;

    public StoreActionViewModel() { }

    public StoreActionViewModel(string type, object payload) {
      Type = type;
      Payload = payload;
    }
  }
}
