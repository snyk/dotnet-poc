![logo](https://res.cloudinary.com/snyk/image/upload/v1468845259/logo/snyk-dog.svg)
## Snyk: .Net POC
***

This POC app is will print a JSON formatted dependencies tree for a given nuget file. 
### Usage
Run `npm install` then `nuget restore` then `node app.js <nuget file path>` 

### Example 
For the following nuget project.json:
```
{
    "dependencies": {
        "Microsoft.NETCore.Portable.Compatibility": "1.0.1",
        "NETStandard.Library": "1.6.1"
    },
    "frameworks": {
        "netstandard1.1": {}
    },
    "language": "en",
    "supports": {},
    "version": "3.0.0-*"
}
```

This will be the output:
```
{
  "name": "app",
  "version": "0.0.0",
  "dependencies": [
    {
      "name": "Microsoft.NETCore.Portable.Compatibility",
      "version": "1.0.1",
      "dependencies": [
        {
          "name": "Microsoft.NETCore.Runtime.CoreCLR",
          "version": "1.0.2",
          "dependencies": [
            {
              "name": "Microsoft.NETCore.Jit",
              "version": "1.0.2",
              "dependencies": [],
              "from": [
                "app@0.0.0",
                "Microsoft.NETCore.Portable.Compatibility@1.0.1",
                "Microsoft.NETCore.Runtime.CoreCLR@1.0.2",
                "Microsoft.NETCore.Jit@1.0.2"
              ]
            },
            {
              "name": "Microsoft.NETCore.Windows.ApiSets",
              "version": "1.0.1",
              "dependencies": [],
              "from": [
                "app@0.0.0",
                "Microsoft.NETCore.Portable.Compatibility@1.0.1",
                "Microsoft.NETCore.Runtime.CoreCLR@1.0.2",
                "Microsoft.NETCore.Windows.ApiSets@1.0.1"
              ]
            }
          ],
          "from": [
            "app@0.0.0",
            "Microsoft.NETCore.Portable.Compatibility@1.0.1",
            "Microsoft.NETCore.Runtime.CoreCLR@1.0.2"
          ]
        }
      ],
      "from": [
        "app@0.0.0",
        "Microsoft.NETCore.Portable.Compatibility@1.0.1"
      ]
    },
    {
      "name": "NETStandard.Library",
      "version": "1.6.1",
      "dependencies": [
        {
          "name": "Microsoft.NETCore.Platforms",
          "version": "1.1.0",
          "dependencies": [],
          "from": [
            "app@0.0.0",
            "NETStandard.Library@1.6.1",
            "Microsoft.NETCore.Platforms@1.1.0"
          ]
        }
      ],
      "from": [
        "app@0.0.0",
        "NETStandard.Library@1.6.1"
      ]
    },
    {
      "name": "runtime.native.System",
      "version": "4.3.0",
      "dependencies": [
        {
          "name": "Microsoft.NETCore.Platforms",
          "version": "1.1.0",
          "dependencies": [],
          "from": [
            "app@0.0.0",
            "runtime.native.System@4.3.0",
            "Microsoft.NETCore.Platforms@1.1.0"
          ]
        },
        {
          "name": "Microsoft.NETCore.Targets",
          "version": "1.1.0",
          "dependencies": [],
          "from": [
            "app@0.0.0",
            "runtime.native.System@4.3.0",
            "Microsoft.NETCore.Targets@1.1.0"
          ]
        }
      ],
      "from": [
        "app@0.0.0",
        "runtime.native.System@4.3.0"
      ]
    }
  ],
  "from": [
    "app@0.0.0"
  ]
}
```
