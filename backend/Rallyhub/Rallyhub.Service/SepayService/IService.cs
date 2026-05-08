namespace Rallyhub.Service.SepayService;

public interface IService
{
    public Task<bool> BookingSepayWebhookHandler(Request.SepayWebhookRequest request);
}