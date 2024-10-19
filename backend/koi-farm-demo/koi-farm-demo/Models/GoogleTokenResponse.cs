using Newtonsoft.Json;

namespace koi_farm_demo.Models
{
    public class GoogleTokenResponse
    {
        [JsonProperty("id_token")]
        public string IdToken { get; set; }

        [JsonProperty("access_token")]
        public string AccessToken { get; set; }
    }
}
