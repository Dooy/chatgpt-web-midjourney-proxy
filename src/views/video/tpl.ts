export const mytpl={
"tpl":[
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
    }

]
}