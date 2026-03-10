import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db/mssql"
import type { Entity, BusinessUnit, Site, City, District, LOV } from "@/lib/db/types"

// GET - Fetch lookup data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const parentid = searchParams.get("parentid")

    switch (type) {
      case "entities":
        const entities = await query<Entity>(
          `SELECT entityid, entitycode, entitystxt, entityltxt 
           FROM Entity WHERE ISNULL(utblock, 0) = 0 ORDER BY entitystxt`
        )
        return NextResponse.json({ data: entities })

      case "businessunits":
        let buWhere = "WHERE ISNULL(utblock, 0) = 0"
        const buParams: Record<string, unknown> = {}
        if (parentid) {
          buWhere += " AND entityid = @entityid"
          buParams.entityid = parseInt(parentid)
        }
        const businessUnits = await query<BusinessUnit>(
          `SELECT busunitid, entityid, busunitcode, busunitstxt, busunitltxt, address, cityid, phone
           FROM BusinessUnit ${buWhere} ORDER BY busunitstxt`,
          buParams
        )
        return NextResponse.json({ data: businessUnits })

      case "sites":
        let siteWhere = "WHERE ISNULL(utblock, 0) = 0"
        const siteParams: Record<string, unknown> = {}
        if (parentid) {
          siteWhere += " AND busunitid = @busunitid"
          siteParams.busunitid = parseInt(parentid)
        }
        const sites = await query<Site>(
          `SELECT siteid, busunitid, sitecode, sitestxt, siteltxt, address
           FROM Site ${siteWhere} ORDER BY sitestxt`,
          siteParams
        )
        return NextResponse.json({ data: sites })

      case "cities":
        let cityWhere = "WHERE ISNULL(utblock, 0) = 0"
        const cityParams: Record<string, unknown> = {}
        if (parentid) {
          cityWhere += " AND stateid = @stateid"
          cityParams.stateid = parseInt(parentid)
        }
        const cities = await query<City>(
          `SELECT cityid, stateid, citycode, citystxt, cityltxt
           FROM City ${cityWhere} ORDER BY citystxt`,
          cityParams
        )
        return NextResponse.json({ data: cities })

      case "districts":
        let distWhere = "WHERE ISNULL(utblock, 0) = 0"
        const distParams: Record<string, unknown> = {}
        if (parentid) {
          distWhere += " AND cityid = @cityid"
          distParams.cityid = parseInt(parentid)
        }
        const districts = await query<District>(
          `SELECT districtid, cityid, districtcode, districtstxt, districtltxt
           FROM District ${distWhere} ORDER BY districtstxt`,
          distParams
        )
        return NextResponse.json({ data: districts })

      case "lov":
        const lovtype = searchParams.get("lovtype")
        if (!lovtype) {
          return NextResponse.json(
            { error: "LOV type is required" },
            { status: 400 }
          )
        }
        const lovs = await query<LOV>(
          `SELECT lovid, lovtype, lovcode, lovstxt, lovltxt, parentid, seqno
           FROM lov WHERE lovtype = @lovtype AND ISNULL(utblock, 0) = 0 AND ISNULL(isactive, 1) = 1
           ORDER BY seqno, lovstxt`,
          { lovtype }
        )
        return NextResponse.json({ data: lovs })

      case "bloodgroups":
        return NextResponse.json({
          data: [
            { id: "A+", name: "A+" },
            { id: "A-", name: "A-" },
            { id: "B+", name: "B+" },
            { id: "B-", name: "B-" },
            { id: "AB+", name: "AB+" },
            { id: "AB-", name: "AB-" },
            { id: "O+", name: "O+" },
            { id: "O-", name: "O-" },
          ],
        })

      case "genders":
        return NextResponse.json({
          data: [
            { id: "Male", name: "Male" },
            { id: "Female", name: "Female" },
            { id: "Other", name: "Other" },
          ],
        })

      case "maritalstatus":
        return NextResponse.json({
          data: [
            { id: "Single", name: "Single" },
            { id: "Married", name: "Married" },
            { id: "Divorced", name: "Divorced" },
            { id: "Widowed", name: "Widowed" },
          ],
        })

      default:
        return NextResponse.json(
          { error: "Invalid lookup type" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("[API] Get lookups error:", error)
    return NextResponse.json(
      { error: "Failed to fetch lookup data" },
      { status: 500 }
    )
  }
}
