package com.ghazal.springbootlibrary.utils;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class ExtractJWT { // can be refactored further

    public static String payloadJWTExtraction(String token, String extraction) {
        token.replace("Bearer ", "");
        //JWT token parts are separated based on a dot
        String[] splitToken = token.split("\\.");
        Base64.Decoder decoder = Base64.getUrlDecoder();
        //get the payload chunk of the jwt json
        String payload = new String(decoder.decode(splitToken[1]));
        //get all the json pairs
        String[] entries = payload.split(",");
        Map<String, String> map = new HashMap<>();
        for (String entry : entries) {
            String[] keyValue = entry.split(":");
            if (keyValue[0].equals(extraction)) { // get the sub key's value

                int remove = 1;
                if (keyValue[1].endsWith("}")) { // making sure sub value is only the email itself
                    remove = 2;
                }
                //remove any other characters other than the email such as }
                keyValue[1] = keyValue[1].substring(0, keyValue[1].length() - remove);
                keyValue[1] = keyValue[1].substring(1);

                map.put(keyValue[0], keyValue[1]);
            }
        }
        if (map.containsKey(extraction)) {
            map.get(extraction);
        }

        return null;

    }
}
