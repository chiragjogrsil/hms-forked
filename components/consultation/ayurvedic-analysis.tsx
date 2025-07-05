"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface AyurvedicAnalysisProps {
  data: any
  onChange: (data: any) => void
}

export function AyurvedicAnalysis({ data, onChange }: AyurvedicAnalysisProps) {
  const updateField = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label>Nadi (Pulse)</Label>
        <Select value={data.nadi || ""} onValueChange={(value) => updateField("nadi", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select pulse type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vata">Vata Nadi</SelectItem>
            <SelectItem value="pitta">Pitta Nadi</SelectItem>
            <SelectItem value="kapha">Kapha Nadi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Mootram (Urine)</Label>
        <Select value={data.mootram || ""} onValueChange={(value) => updateField("mootram", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select urine type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="agnimandya">Agnimandya – Matulungarasa</SelectItem>
            <SelectItem value="ajeerna">Ajeerna – Tandulodaka</SelectItem>
            <SelectItem value="vatapittaprakopa">Vatapittaprakopa – Dhumrajalabha</SelectItem>
            <SelectItem value="vatakapha">Vatakapha Prakopa – Phenila and Sweta</SelectItem>
            <SelectItem value="kaphapittaprakopa">Kaphapittaprakopa – Rakthavarna and Kalusha</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Malam (Faecal Matter)</Label>
        <Select value={data.malam || ""} onValueChange={(value) => updateField("malam", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select stool type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vata">Mala Vitiated by Vata - Dry, Hard with Blackish Discoloration</SelectItem>
            <SelectItem value="pitta">Mala Vitiated by Pitta - Yellow & Green Colored</SelectItem>
            <SelectItem value="kapha">Mala Vitiated by Kapha – White Colored Stools</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Jihwa (Tongue)</Label>
        <Select value={data.jihwa || ""} onValueChange={(value) => updateField("jihwa", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select tongue condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vata">Vata Prakopa – Cold, Rough and Cracked Tongue</SelectItem>
            <SelectItem value="pitta">Pittaprakopa – Yellow or Red Color Tongue</SelectItem>
            <SelectItem value="kapha">Kaphaprakopa – White & Slimy</SelectItem>
            <SelectItem value="dwanda">Dwandaprakopa – Combined Features</SelectItem>
            <SelectItem value="sannipata">Sannipata Pakopa – Black in Color with Thorn Like Structures</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Shabda (Voice)</Label>
        <Select value={data.shabda || ""} onValueChange={(value) => updateField("shabda", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select voice type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vata">Vataparakopa – Guru, Sphuta and Abnormal Shabda</SelectItem>
            <SelectItem value="pitta">Pittaprakopa – Aspashta Shabda</SelectItem>
            <SelectItem value="kapha">
              Kapha Prakopa – Guru, Durbala, Aspashta and Nasarodha Anunasika Shabda
            </SelectItem>
            <SelectItem value="vaatapitta">Vaatapitta – Pralaapa (Delerium)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Sparsha (Touch)</Label>
        <Select value={data.sparsha || ""} onValueChange={(value) => updateField("sparsha", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select touch type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vata">Vataja Lakshana– Sheeta Sparsha</SelectItem>
            <SelectItem value="pitta">Pittaja Lakshana– Ushna Sparsha</SelectItem>
            <SelectItem value="kapha">Kaphaja Lakshana– Ardra Sparsha</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Druk (Eyes and Vision)</Label>
        <Select value={data.druk || ""} onValueChange={(value) => updateField("druk", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select eye condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vata">Vataja – Smoky (Dhoomra) Aruna Varna, Ruksha, Chanchala Sunken Eyes</SelectItem>
            <SelectItem value="pitta">Pittaja – Haridra and Rakta Varna, Thikshna, Lustrous And Dahayukta</SelectItem>
            <SelectItem value="kapha">Kaphaja – Sveta, Dhavala, Snigdha</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Akruti (General Body Build)</Label>
        <Select value={data.akruti || ""} onValueChange={(value) => updateField("akruti", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select body build" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pramana">Pramana Samhanana Pariksha</SelectItem>
            <SelectItem value="other">Other Assessment</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
