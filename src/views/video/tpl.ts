export const mytpl={
"tpl":[
    {
        "model":"sora-2",
        "field":[
           {
            "key":"prompt",
                "type":"textarea",
                "placeholder":"Video Description",
                "value":"在北京繁忙的人行道上进行的一个随意街头采访。采访者手持一个普通、没有品牌标志的麦克风并问道：你知道OpenAI的Sora 2新模型吗？这是一个好用的视频模型。受访者回答说：是的，我有所了解，它已经可以在openai-hk平台上使用，太好用了。"
               
            }
            
             ,{
                "key":"orientation",
                "type":"select",
                "value":"portrait",
                "options":[
                    { "label":"模式: 竖屏", "value":"portrait"}
                    ,{ "label":"模式: 横屏", "value":"landscape"}
                ]
            } 
             ,{
                "key":"duration",
                "type":"select",
                "value":15,
                "options":[
                    { "label":"Duration: 15s", "value":15}
                    ,{ "label":"Duration: 10s", "value":10}
                ]
            }
            ,
            
            {   
                "key":"images",
                "type":"image_base64_url_array",
                "max":2
            }     
        ]
        ,"plat":"sora"
    },
    
    {
        "model":"sora-2-pro",
        "field":[
           {
            "key":"prompt",
                "type":"textarea",
                "placeholder":"Video Description",
                "value":"在北京繁忙的人行道上进行的一个随意街头采访。采访者手持一个普通、没有品牌标志的麦克风并问道：你知道OpenAI的Sora 2新模型吗？这是一个好用的视频模型。受访者回答说：是的，我有所了解，它已经可以在openai-hk平台上使用，太好用了。"
               
            }
            
             ,{
                "key":"orientation",
                "type":"select",
                "value":"portrait",
                "options":[
                    { "label":"模式: 竖屏", "value":"portrait"}
                    ,{ "label":"模式: 横屏", "value":"landscape"}
                ]
            }
             ,{
                "key":"size",
                "type":"select",
                "value":"large",
                "options":[
                    { "label":"清晰: 高清", "value":"large"}
                    ,{ "label":"清晰: 一般", "value":"small"}
                ]
            }
             ,{
                "key":"duration",
                "type":"select",
                "value":15,
                "options":[
                    { "label":"Duration: 25s", "value":25}
                    ,{ "label":"Duration: 15s", "value":15}
                    ,{ "label":"Duration: 10s", "value":10}
                ]
            }
            
            ,
            
            {   
                "key":"images",
                "type":"image_base64_url_array",
                "max":2
            }     
        ]
        ,"plat":"sora"
    },

    {
        "model":"openai/sora-2",
        "key":"sora-2",
        "field":[
           {
            "key":"prompt",
                "type":"textarea",
                "placeholder":"Video Description",
                "value":"在北京繁忙的人行道上进行的一个随意街头采访。采访者手持一个普通、没有品牌标志的麦克风并问道：你知道OpenAI的Sora 2新模型吗？这是一个好用的视频模型。受访者回答说：是的，我有所了解，它已经可以在openai-hk平台上使用，太好用了。"
               
            }
            
             ,{
                "key":"size",
                "type":"select",
                "value":"720x1280",
                "options":[
                    { "label":"size: 720x1280", "value":"720x1280"}
                    ,{ "label":"size: 1280x720", "value":"1280x720"}
                ]
            } 
             ,{
                "key":"seconds",
                "type":"select",
                "value":4,
                "options":[
                    { "label":"Duration: 15s", "value":15}
                    ,{ "label":"Duration: 10s", "value":10}
                    ,{ "label":"Duration: 8s", "value":8}
                    ,{ "label":"Duration: 4s", "value":4}
                ]
            }
            ,
            
            {   
                "key":"input_reference",
                "type":"image_base64_file",
                "max":1
            }     
        ]
        ,"plat":"openai"
    },


    {
        "model":"openai/sora-2-pro",
        "key":"sora-2-pro",
        "field":[
           {
            "key":"prompt",
                "type":"textarea",
                "placeholder":"Video Description",
                "value":"在北京繁忙的人行道上进行的一个随意街头采访。采访者手持一个普通、没有品牌标志的麦克风并问道：你知道OpenAI的Sora 2新模型吗？这是一个好用的视频模型。受访者回答说：是的，我有所了解，它已经可以在openai-hk平台上使用，太好用了。"
               
            }
            
             ,{
                "key":"size",
                "type":"select",
                "value":"720x1280",
                "options":[
                    { "label":"size: 720x1280", "value":"720x1280"}
                    ,{ "label":"size: 1280x720", "value":"1280x720"}
                ]
            } 
             ,{
                "key":"seconds",
                "type":"select",
                "value":4,
                "options":[
                    { "label":"Duration: 25s", "value":25}
                    ,{ "label":"Duration: 15s", "value":15}
                    ,{ "label":"Duration: 10s", "value":10}
                    ,{ "label":"Duration: 8s", "value":8}
                    ,{ "label":"Duration: 4s", "value":4}
                ]
            }
            ,
            
            {   
                "key":"input_reference",
                "type":"image_base64_file",
                "max":1
            }     
        ]
        ,"plat":"openai"
    },
   
    {
        "model":"veo3.1",
       "field":[
           {
            "key":"prompt",
                "type":"textarea",
                "placeholder":"Video Description"
            }
            ,{
                "key":"enhance_prompt",
                "type":"no",
                "value":true
            }
            ,{
                "key":"aspect_ratio",
                "type":"select",
                "value":"16:9",
                "options":[
                    { "label":"Ratio 16:9", "value":"16:9"}
                    ,{ "label":"Ratio 9:16", "value":"9:16"}
                ]
            },
            {   
                "key":"images",
                "type":"image_base64_url_array",
                "max":1
            }     
        ]
        ,"plat":"google-veo"
    } ,
    {
        "model":"veo3.1-pro",
       "field":[
           {
            "key":"prompt",
                "type":"textarea",
                "placeholder":"Video Description"
            }
            ,{
                "key":"enhance_prompt",
                "type":"no",
                "value":true
            }
            ,{
                "key":"aspect_ratio",
                "type":"select",
                "value":"16:9",
                "options":[
                    { "label":"Ratio 16:9", "value":"16:9"}
                    ,{ "label":"Ratio 9:16", "value":"9:16"}
                ]
            },
            {   
                "key":"images",
                "type":"image_base64_url_array",
                "max":1
            }     
        ]
        ,"plat":"google-veo"
    } ,
 {
        "model":"veo3.1-components",
       "field":[
           {
            "key":"prompt",
                "type":"textarea",
                "placeholder":"Video Description"
            }
            ,{
                "key":"enhance_prompt",
                "type":"no",
                "value":true
            },
            {   
                "key":"images",
                "type":"image_base64_url_array",
                "max":3
            }     
        ]
        ,"plat":"google-veo"
    } ,
    {
        "model":"veo3-fast-frames",
        "field":[
           {
            "key":"prompt",
                "type":"textarea",
                "placeholder":"Video Description"
               
            }
            ,{
                "key":"enhance_prompt",
                "type":"no",
                "value":true
            },
            {   
                "key":"images",
                "type":"image_base64_url_array",
                "max":2
            }     
        ]
        ,"plat":"google-veo"
    },
    {
        "model":"veo2-fast-frames",
        "field":[
           {
            "key":"prompt",
                "type":"textarea",
                "placeholder":"Video Description"
               
            }
            ,{
                "key":"enhance_prompt",
                "type":"no",
                "value":true
            },
            {   
                "key":"images",
                "type":"image_base64_url_array",
                "max":2
            }     
        ]
        ,"plat":"google-veo"
    },
    {
        "model":"veo2-fast-components",
       "field":[
           {
            "key":"prompt",
                "type":"textarea",
                "placeholder":"Video Description"
            }
            ,{
                "key":"enhance_prompt",
                "type":"no",
                "value":true
            },
            {   
                "key":"images",
                "type":"image_base64_url_array",
                "max":3
            }     
        ]
        ,"plat":"google-veo"
    } ,
    {
        "model":"veo3-fast",
       "field":[
           {
            "key":"prompt",
                "type":"textarea",
                "placeholder":"Video Description"
            }
            ,{
                "key":"enhance_prompt",
                "type":"no",
                "value":true
            }
            ,{
                "key":"aspect_ratio",
                "type":"select",
                "value":"16:9",
                "options":[
                    { "label":"Ratio 16:9", "value":"16:9"}
                    ,{ "label":"Ratio 9:16", "value":"9:16"}
                ]
            }
        ]
        ,"plat":"google-veo"
    } ,
    {
        "model":"veo3",
       "field":[
           {
            "key":"prompt",
                "type":"textarea",
                "placeholder":"Video Description"
            }
            ,{
                "key":"enhance_prompt",
                "type":"no",
                "value":true
            } ,{
                "key":"aspect_ratio",
                "type":"select",
                "value":"16:9",
                "options":[
                    { "label":"Ratio 16:9", "value":"16:9"}
                    ,{ "label":"Ratio 9:16", "value":"9:16"}
                ]
            }
        ]
        ,"plat":"google-veo"
    } ,
    {
        "model":"veo3-pro",
       "field":[
           {
            "key":"prompt",
                "type":"textarea",
               "placeholder":"Video Description"
            }
            ,{
                "key":"enhance_prompt",
                "type":"no",
                "value":true
            } ,{
                "key":"aspect_ratio",
                "type":"select",
                "value":"16:9",
                "options":[
                    { "label":"Ratio 16:9", "value":"16:9"}
                    ,{ "label":"Ratio 9:16", "value":"9:16"}
                ]
            }
        ]
        ,"plat":"google-veo"
    } ,
    {
        "model":"veo3-pro-frames",
        "field":[
           {
            "key":"prompt",
                "type":"textarea",
                "placeholder":"Video Description"
            }
            ,{
                "key":"enhance_prompt",
                "type":"no",
                "value":true
            },
            {   
                "key":"images",
                "type":"image_base64_url_array",
                "max":1
            }     
        ]
        ,"plat":"google-veo"
    },{
    "model":"fal-ai/ltxv-13b-098-distilled/image-to-video",
    "plat":"fal-ai",
    "field":[
        {
            "key":"prompt",
            "type":"textarea",
            "placeholder":"Video Description",
            "value":"The astronaut gets up and walks away"
        },{
            "key":"resolution",
            "type":"select",
            "value":"720p",
            "options":[
                { "label":"Resolution 480p", "value":"480p"}
                ,{ "label":"Resolution 720p", "value":"720p"}
            ]

        },{   
                "key":"image_url",
                "type":"image_base64_url",
                "value":"https://storage.googleapis.com/falserverless/example_inputs/ltxv-image-input.jpg"
        }     
        ]

    },{
      "model":"fal-ai/ltxv-13b-098-distilled",
      "field":[
        {
            "key":"prompt",
            "type":"textarea",
            "placeholder":"Video Description",
            "value":"A cinematic fast-tracking shot follows a vintage, teal camper van as it descends a winding mountain trail. The van, slightly weathered but well-maintained, is the central focus, its retro design emphasized by the motion blur. Medium shot reveals the dusty, ochre trail, edged with vibrant green pine trees. Close-up on the van's tires shows the gravel spraying, highlighting the speed and rugged terrain. Sunlight filters through the trees, casting dappled shadows on the van and the trail. The background is a hazy, majestic mountain range bathed in warm, golden light. The overall mood is adventurous and exhilarating. High resolution 4k movie scene."
        },{
            "key":"resolution",
            "type":"select",
            "value":"720p",
            "options":[
                { "label":"Resolution 480p", "value":"480p"}
                ,{ "label":"Resolution 720p", "value":"720p"}
            ]
        },{
                "key":"aspect_ratio",
                "type":"select",
                "value":"1:1",
                "options":[
                    { "label":"Ratio 16:9", "value":"16:9"}
                    ,{ "label":"Ratio 9:16", "value":"9:16"}
                    ,{ "label":"Ratio 1:1", "value":"1:1"}
                ]
        } 
        ],
        "plat":"fal-ai"
    },{
      "model":"fal-ai/kling-video/v2.1/master/text-to-video",
      "field":[
        {
            "key":"prompt",
            "type":"textarea",
            "placeholder":"Video Description",
            "value":"A cinematic fast-tracking shot follows a vintage, teal camper van as it descends a winding mountain trail. The van, slightly weathered but well-maintained, is the central focus, its retro design emphasized by the motion blur. Medium shot reveals the dusty, ochre trail, edged with vibrant green pine trees. Close-up on the van's tires shows the gravel spraying, highlighting the speed and rugged terrain. Sunlight filters through the trees, casting dappled shadows on the van and the trail. The background is a hazy, majestic mountain range bathed in warm, golden light. The overall mood is adventurous and exhilarating. High resolution 4k movie scene."
        },{
            "key":"duration",
            "type":"select",
            "value":5,
            "options":[
                { "label":"Duration 5s", "value":5}
                ,{ "label":"Duration 10s", "value": 10}
            ]
        },{
                "key":"aspect_ratio",
                "type":"select",
                "value":"1:1",
                "options":[
                    { "label":"Ratio 16:9", "value":"16:9"}
                    ,{ "label":"Ratio 9:16", "value":"9:16"}
                    ,{ "label":"Ratio 1:1", "value":"1:1"}
                ]
        } 
        ],
        "plat":"fal-ai"
    },{
      "model":"fal-ai/kling-video/v2.1/standard/image-to-video",
      "field":[
        {
            "key":"prompt",
            "type":"textarea",
            "placeholder":"Video Description",
            "value":"Warm, incandescent streetlights paint the rain-slicked cobblestones in pools of amber light as a couple walks hand-in-hand, their silhouettes stark against the blurry backdrop of a city shrouded in a gentle downpour; the camera lingers on the subtle textures of their rain-soaked coats and the glistening reflections dancing on the wet pavement, creating a sense of intimate vulnerability and shared quietude."
        },{
            "key":"duration",
            "type":"select",
            "value":5,
            "options":[
                { "label":"Duration 5s", "value":5}
                ,{ "label":"Duration 10s", "value": 10}
            ]
        },{   
                "key":"image_url",
                "type":"image_base64_url",
                "value":"https://v3.fal.media/files/lion/_I_io6Gtk83c72d-afXf8_image.webp"
        }     
        ],
        "plat":"fal-ai"
    },{
      "model":"fal-ai/kling-video/v2.1/pro/image-to-video",
      "field":[
        {
            "key":"prompt",
            "type":"textarea",
            "placeholder":"Video Description",
            "value":"Warm, incandescent streetlights paint the rain-slicked cobblestones in pools of amber light as a couple walks hand-in-hand, their silhouettes stark against the blurry backdrop of a city shrouded in a gentle downpour; the camera lingers on the subtle textures of their rain-soaked coats and the glistening reflections dancing on the wet pavement, creating a sense of intimate vulnerability and shared quietude."
        },{
            "key":"duration",
            "type":"select",
            "value":5,
            "options":[
                { "label":"Duration 5s", "value":5}
                ,{ "label":"Duration 10s", "value": 10}
            ]
        },{   
                "key":"image_url",
                "type":"image_base64_url",
                "value":"https://v3.fal.media/files/lion/_I_io6Gtk83c72d-afXf8_image.webp"
        }     
        ],
        "plat":"fal-ai"
    },{
      "model":"fal-ai/kling-video/v2.1/master/image-to-video",
      "field":[
        {
            "key":"prompt",
            "type":"textarea",
            "placeholder":"Video Description",
            "value":"Sunlight dapples through budding branches, illuminating a vibrant tapestry of greens and browns as a pair of robins meticulously weave twigs and mud into a cradle of life, their tiny forms a whirlwind of activity against a backdrop of blossoming spring.  The scene unfolds with a gentle, observational pace, allowing the viewer to fully appreciate the intricate details of nest construction, the soft textures of downy feathers contrasted against the rough bark of the branches, the delicate balance of strength and fragility in their creation."
        },{
            "key":"duration",
            "type":"select",
            "value":5,
            "options":[
                { "label":"Duration 5s", "value":5}
                ,{ "label":"Duration 10s", "value": 10}
            ]
        },{   
                "key":"image_url",
                "type":"image_base64_url",
                "value":"https://v3.fal.media/files/zebra/9Nrm22YyLojSTPJbZYNhh_image.webp"
        }     
        ],
        "plat":"fal-ai"
    },{
      "model":"fal-ai/minimax/hailuo-02/standard/text-to-video",
      "field":[
        {
            "key":"prompt",
            "type":"textarea",
            "placeholder":"Video Description",
            "value":"A Galactic Smuggler is a rogue figure with a cybernetic arm and a well-worn coat that hints at many dangerous escapades across the galaxy. Their ship is filled with rare and exotic treasures from distant planets, concealed in hidden compartments, showing their expertise in illicit trade. Their belt is adorned with energy-based weapons, ready to be drawn at any moment to protect themselves or escape from tight situations. This character thrives in the shadows of space, navigating between the law and chaos with stealth and wit, always seeking the next big score while evading bounty hunters and law enforcement. The rogue's ship, rugged yet efficient, serves as both a home and a tool for their dangerous lifestyle. The treasures they collect reflect the diverse and intriguing worlds they've encountered—alien artifacts, rare minerals, and artifacts of unknown origin. Their reputation precedes them, with whispers of their dealings and the deadly encounters that often follow. A master of negotiation and deception, the Galactic Smuggler navigates the cosmos with an eye on the horizon, always one step ahead of those who pursue them."
        }     
        ],
        "plat":"fal-ai"
    },{
      "model":"fal-ai/minimax/hailuo-02/pro/text-to-video",
      "field":[
        {
            "key":"prompt",
            "type":"textarea",
            "placeholder":"Video Description",
            "value":"A Galactic Smuggler is a rogue figure with a cybernetic arm and a well-worn coat that hints at many dangerous escapades across the galaxy. Their ship is filled with rare and exotic treasures from distant planets, concealed in hidden compartments, showing their expertise in illicit trade. Their belt is adorned with energy-based weapons, ready to be drawn at any moment to protect themselves or escape from tight situations. This character thrives in the shadows of space, navigating between the law and chaos with stealth and wit, always seeking the next big score while evading bounty hunters and law enforcement. The rogue's ship, rugged yet efficient, serves as both a home and a tool for their dangerous lifestyle. The treasures they collect reflect the diverse and intriguing worlds they've encountered—alien artifacts, rare minerals, and artifacts of unknown origin. Their reputation precedes them, with whispers of their dealings and the deadly encounters that often follow. A master of negotiation and deception, the Galactic Smuggler navigates the cosmos with an eye on the horizon, always one step ahead of those who pursue them."
        }     
        ],
        "plat":"fal-ai"
    },{
      "model":"fal-ai/minimax/hailuo-02-fast/image-to-video",
      "field":[
        {
            "key":"prompt",
            "type":"textarea",
            "placeholder":"Video Description",
            "value":"Extremely realistic movement An old samurai is breaking a stone in half"
        },{
            "key":"duration",
            "type":"select",
            "value":5,
            "options":[
                { "label":"Duration 6s", "value":6}
                ,{ "label":"Duration 10s", "value": 10}
            ]
        },{   
                "key":"image_url",
                "type":"image_base64_url",
                "value":"https://v3.fal.media/files/tiger/U9HN_tm5-3Ls52SbD6CrW_image.webp"
        }     
        ],
        "plat":"fal-ai"
    },{
      "model":"fal-ai/minimax/hailuo-02/pro/image-to-video",
      "field":[
        {
            "key":"prompt",
            "type":"textarea",
            "placeholder":"Video Description",
            "value":"Man walked into winter cave with polar bear"
        },{
            "key":"duration",
            "type":"select",
            "value":5,
            "options":[
                { "label":"Duration 6s", "value":6}
                ,{ "label":"Duration 10s", "value": 10}
            ]
        },{
            "key":"resolution",
            "type":"select",
            "value":"768P",
            "options":[
                { "label":"Resolution 512P", "value":"512P"}
                ,{ "label":"Resolution 768P", "value":"768P"}
            ]

        },{   
                "key":"image_url",
                "type":"image_base64_url",
                "value":"https://storage.googleapis.com/falserverless/model_tests/minimax/1749891352437225630-389852416840474630_1749891352.png"
        }     
        ],
        "plat":"fal-ai"
    },{
      "model":"fal-ai/minimax/hailuo-02/standard/image-to-video",
      "field":[
        {
            "key":"prompt",
            "type":"textarea",
            "placeholder":"Video Description",
            "value":"Man walked into winter cave with polar bear"
        },{
            "key":"duration",
            "type":"select",
            "value":5,
            "options":[
                { "label":"Duration 6s", "value":6}
                ,{ "label":"Duration 10s", "value": 10}
            ]
        },{
            "key":"resolution",
            "type":"select",
            "value":"768P",
            "options":[
                { "label":"Resolution 512P", "value":"512P"}
                ,{ "label":"Resolution 768P", "value":"768P"}
            ]

        },{   
                "key":"image_url",
                "type":"image_base64_url",
                "value":"https://storage.googleapis.com/falserverless/model_tests/minimax/1749891352437225630-389852416840474630_1749891352.png"
        }     
        ],
        "plat":"fal-ai"
    }

    ,{
      "model":"fal-ai/pika/v2.1/text-to-video",
      "field":[
        {
            "key":"prompt",
            "type":"textarea",
            "placeholder":"Video Description",
            "value":"A young woman in a pale blue corset and denim, her vibrant blue bob framed against a dusky desert landscape, walks slowly, her gaze unwavering and enigmatic as the camera remains fixed on her deliberate pace.  The warm glow of a stucco house contrasts with the cool desert air, hinting at both refuge and isolation, while a blurred figure retreating inside adds a layer of unspoken narrative to her solitary journey."
        },{
            "key":"resolution",
            "type":"select",
            "value":"720p",
            "options":[
                { "label":"Resolution 720p", "value":"720p"}
                ,{ "label":"Resolution 1080p", "value":"1080p"}
            ]

        },{
            "key":"aspect_ratio",
            "type":"select",
            "value":"16:9",
            "options":[
                { "label":"Ratio 16:9", "value":"16:9"}
                ,{ "label":"Ratio 9:16", "value":"9:16"}
                ,{ "label":"Ratio 1:1", "value":"1:1"}
                ,{ "label":"Ratio 4:5", "value":"4:5"}
                ,{ "label":"Ratio 5:4", "value":"5:4"}
                ,{ "label":"Ratio 3:2", "value":"3:2"}
                ,{ "label":"Ratio 2:3", "value":"2:3"}
            ]
        },{
            "key":"duration",
            "type":"select",
            "value":5,
            "options":[
                { "label":"Duration 5s", "value":5}
                ,{ "label":"Duration 8s", "value": 8}
            ]
        }    
        ],
        "plat":"fal-ai"
    },{
      "model":"fal-ai/pika/v2.2/text-to-video",
      "field":[
        {
            "key":"prompt",
            "type":"textarea",
            "placeholder":"Video Description",
            "value":"Sunlight streams down on a woman with flowing auburn hair as she runs effortlessly along a tree-lined street, her joyous expression reflecting the freedom of the moment; the simple, steady camerawork emphasizes her grace and the beauty of the everyday."
        },{
            "key":"resolution",
            "type":"select",
            "value":"720p",
            "options":[
                { "label":"Resolution 720p", "value":"720p"}
                ,{ "label":"Resolution 1080p", "value":"1080p"}
            ]

        },{
            "key":"aspect_ratio",
            "type":"select",
            "value":"16:9",
            "options":[
                { "label":"Ratio 16:9", "value":"16:9"}
                ,{ "label":"Ratio 9:16", "value":"9:16"}
                ,{ "label":"Ratio 1:1", "value":"1:1"}
                ,{ "label":"Ratio 4:5", "value":"4:5"}
                ,{ "label":"Ratio 5:4", "value":"5:4"}
                ,{ "label":"Ratio 3:2", "value":"3:2"}
                ,{ "label":"Ratio 2:3", "value":"2:3"}
            ]
        },{
            "key":"duration",
            "type":"select",
            "value":5,
            "options":[
                { "label":"Duration 5s", "value":5}
                ,{ "label":"Duration 8s", "value": 8}
            ]
        }   
        ],
        "plat":"fal-ai"
    }
    ,{
      "model":"fal-ai/pika/v2/turbo/text-to-video",
      "field":[
        {
            "key":"prompt",
            "type":"textarea",
            "placeholder":"Video Description",
            "value":"A young woman in a pale blue corset and denim, her vibrant blue bob framed against a dusky desert landscape, walks slowly, her gaze unwavering and enigmatic as the camera remains fixed on her deliberate pace.  The warm glow of a stucco house contrasts with the cool desert air, hinting at both refuge and isolation, while a blurred figure retreating inside adds a layer of unspoken narrative to her solitary journey."
        } ,{
            "key":"resolution",
            "type":"select",
            "value":"720p",
            "options":[
                { "label":"Resolution 720p", "value":"720p"}
                ,{ "label":"Resolution 1080p", "value":"1080p"}
            ]

        },{
            "key":"aspect_ratio",
            "type":"select",
            "value":"16:9",
            "options":[
                { "label":"Ratio 16:9", "value":"16:9"}
                ,{ "label":"Ratio 9:16", "value":"9:16"}
                ,{ "label":"Ratio 1:1", "value":"1:1"}
                ,{ "label":"Ratio 4:5", "value":"4:5"}
                ,{ "label":"Ratio 5:4", "value":"5:4"}
                ,{ "label":"Ratio 3:2", "value":"3:2"}
                ,{ "label":"Ratio 2:3", "value":"2:3"}
            ]
        } ,{
            "key":"duration",
            "type":"select",
            "value":5,
            "options":[
                { "label":"Duration 5s", "value":5}
                ,{ "label":"Duration 8s", "value": 8}
            ]
        }  
        ],
        "plat":"fal-ai"
    }

 
    ,{
      "model":"fal-ai/pika/v2.1/image-to-video",
      "field":[
        {
            "key":"prompt",
            "type":"textarea",
            "placeholder":"Video Description",
            "value":"A pink heart exploding."
        } ,{
            "key":"resolution",
            "type":"select",
            "value":"720p",
            "options":[
                { "label":"Resolution 720p", "value":"720p"}
                ,{ "label":"Resolution 1080p", "value":"1080p"}
            ]

        } ,{
            "key":"duration",
            "type":"select",
            "value":5,
            "options":[
                { "label":"Duration 5s", "value":5}
                ,{ "label":"Duration 8s", "value": 8}
            ]
        },{   
                "key":"image_url",
                "type":"image_base64_url",
                "value":"https://v3.fal.media/files/elephant/dJjBQXNHRbGJn4aUv4-g9_hearth.jpg"
        }       
        ],
        "plat":"fal-ai"
    },{
      "model":"fal-ai/pika/v2.2/image-to-video",
      "field":[
        {
            "key":"prompt",
            "type":"textarea",
            "placeholder":"Video Description",
            "value":"a woman looking into camera slowly smiling"
        } ,{
            "key":"resolution",
            "type":"select",
            "value":"720p",
            "options":[
                { "label":"Resolution 720p", "value":"720p"}
                ,{ "label":"Resolution 1080p", "value":"1080p"}
            ]

        } ,{
            "key":"duration",
            "type":"select",
            "value":5,
            "options":[
                { "label":"Duration 5s", "value":5}
                ,{ "label":"Duration 8s", "value": 8}
            ]
        },{   
                "key":"image_url",
                "type":"image_base64_url",
                "value":"https://storage.googleapis.com/falserverless/web-examples/pika/pika%202.2/pika_input.png"
        }       
        ],
        "plat":"fal-ai"
    },{
      "model":"fal-ai/pika/v2/turbo/image-to-video",
      "field":[
        {
            "key":"prompt",
            "type":"textarea",
            "placeholder":"Video Description",
            "value":"A pink heart exploding."
        } ,{
            "key":"resolution",
            "type":"select",
            "value":"720p",
            "options":[
                { "label":"Resolution 720p", "value":"720p"}
                ,{ "label":"Resolution 1080p", "value":"1080p"}
            ]

        } ,{
            "key":"duration",
            "type":"select",
            "value":5,
            "options":[
                { "label":"Duration 5s", "value":5}
                ,{ "label":"Duration 8s", "value": 8}
            ]
        },{   
                "key":"image_url",
                "type":"image_base64_url",
                "value":"https://v3.fal.media/files/elephant/dJjBQXNHRbGJn4aUv4-g9_hearth.jpg"
        }       
        ],
        "plat":"fal-ai"
    }

]
}